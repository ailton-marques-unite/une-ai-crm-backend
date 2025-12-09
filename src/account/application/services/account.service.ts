import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Login } from '../../domain/entities/login.entity';
import { Usuario } from '../../domain/entities/usuario.entity';
import { UsuarioAutenticacao } from '../../domain/entities/usuario-autenticacao.entity';
import { Email } from '../../domain/entities/email.entity';
import { HistoricoSenha } from '../../domain/entities/historico-senha.entity';
import { AcessoUsuarioCelular } from '../../domain/entities/acesso-usuario-celular.entity';
import { AcessoUsuario } from '../../domain/entities/acesso-usuario.entity';
import { UsuarioAcesso } from '../../domain/entities/usuario-acesso.entity';
import { UsuarioPausa } from '../../domain/entities/usuario-pausa.entity';
import { UsuarioMultiAcesso } from '../../domain/entities/usuario-multi-acesso.entity';
import { SubGrupo } from '../../domain/entities/subgrupo.entity';
import { Grupo } from '../../domain/entities/grupo.entity';
import { Modulo } from '../../domain/entities/modulo.entity';
import { ModuloXCliente } from '../../domain/entities/modulo-x-cliente.entity';
import { PermissaoUsuarioXSubGrupo } from '../../domain/entities/permissao-usuario-x-subgrupo.entity';
import { GrupoAcessoUsuario } from '../../domain/entities/grupo-acesso-usuario.entity';
import { Cliente } from '../../domain/entities/cliente.entity';
import { UsuarioValidacaoDto } from '../../application/dtos/usuario-validacao.dto';
import { LoginDto } from '../../application/dtos/login.dto';
import { UsuarioDto } from '../../application/dtos/usuario.dto';
import { AutenticacaoDto } from '../../application/dtos/autenticacao.dto';
import { EmailDto } from '../../application/dtos/email.dto';
import { PausaDto } from '../../application/dtos/pausa.dto';
import { ClienteMenuDto } from '../../application/dtos/cliente-menu.dto';
import { MenuDto } from '../../application/dtos/menu.dto';
import { PermissaoDto } from '../../application/dtos/permissao.dto';
import { ClienteDto } from '../../application/dtos/cliente.dto';
import { IntervaloControleHorarioDto } from '../../application/dtos/intervalo-controle-horario.dto';
import { SaidaIntervaloControleHorarioDto } from '../../application/dtos/saida-intervalo-controle-horario.dto';
import { PausaControleHorarioDto } from '../../application/dtos/pausa-controle-horario.dto';
import { UsuarioControle } from 'src/account/domain/entities/usuario-controle.entity';
import { UsuarioXPermissao } from 'src/account/domain/entities/usuario-x-permissao.entity';
import { Cargo } from 'src/account/domain/entities/cargo.entity';
import { Departamento } from 'src/account/domain/entities/departamento.entity';
import { Empresa } from 'src/account/domain/entities/empresa.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Login)
    private readonly loginRepository: Repository<Login>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(UsuarioAutenticacao)
    private readonly usuarioAutenticacaoRepository: Repository<UsuarioAutenticacao>,
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    @InjectRepository(HistoricoSenha)
    private readonly historicoSenhaRepository: Repository<HistoricoSenha>,
    @InjectRepository(AcessoUsuarioCelular)
    private readonly acessoUsuarioCelularRepository: Repository<AcessoUsuarioCelular>,
    @InjectRepository(AcessoUsuario)
    private readonly acessoUsuarioRepository: Repository<AcessoUsuario>,
    @InjectRepository(UsuarioAcesso)
    private readonly usuarioAcessoRepository: Repository<UsuarioAcesso>,
    @InjectRepository(UsuarioPausa)
    private readonly usuarioPausaRepository: Repository<UsuarioPausa>,
    @InjectRepository(UsuarioMultiAcesso)
    private readonly usuarioMultiAcessoRepository: Repository<UsuarioMultiAcesso>,
    @InjectRepository(PermissaoUsuarioXSubGrupo)
    private readonly permissaoUsuarioXSubGrupoRepository: Repository<PermissaoUsuarioXSubGrupo>,
    @InjectRepository(GrupoAcessoUsuario)
    private readonly grupoAcessoUsuarioRepository: Repository<GrupoAcessoUsuario>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Método equivalente ao CarregarDadosUsuarioValidacao do C#
   * @param tipo 1 = busca por ds_Usuario, 2 = busca por ds_Email
   * @param usuario Nome de usuário ou email
   * @returns Lista de usuários encontrados
   */
  async carregarDadosUsuarioValidacao(
    tipo: number,
    usuario: string,
  ): Promise<UsuarioValidacaoDto[]> {
    const queryBuilder = this.loginRepository
      .createQueryBuilder('L')
      .innerJoin('L.usuario', 'U')
      .innerJoin('U.cliente', 'C')
      .innerJoin('C.empresa', 'E')
      .select([
        'C.Id_Empresa as id_Empresa',
        'E.nm_Fantasia as nm_Empresa',
        'U.Id_Cliente as id_Cliente',
        'L.Id_Usuario as id_Usuario',
        'L.fl_Primeiro_Acesso as fl_Primeiro_Acesso',
        'L.dt_Ultima_Senha as dt_Ultima_Senha',
        'L.ds_Usuario as ds_Usuario',
        'L.ds_Email as ds_Email',
        'U.nm_Usuario as nm_Usuario',
      ])
      .where('U.fl_Excluido = :flExcluido', { flExcluido: 'N' })
      .andWhere('E.fl_Excluido = :flExcluidoEmpresa', { flExcluidoEmpresa: 0 })
      .andWhere('E.fl_Ativo = :flAtivo', { flAtivo: 1 })
      .orderBy('E.nm_Fantasia', 'ASC');

    // Aplica condição baseada no tipo
    if (tipo === 1) {
      queryBuilder.andWhere('L.ds_Usuario = :usuario', { usuario });
    } else {
      queryBuilder.andWhere('L.ds_Email = :usuario', { usuario });
    }

    const results = await queryBuilder.getRawMany();

    // Mapeia os resultados para o DTO
    return results.map((row) => ({
      id_Empresa: row.id_Empresa,
      nm_Empresa: row.nm_Empresa,
      id_Cliente: row.id_Cliente,
      id_Usuario: row.id_Usuario,
      fl_Primeiro_Acesso: row.fl_Primeiro_Acesso,
      dt_Ultima_Senha: row.dt_Ultima_Senha,
      ds_Usuario: row.ds_Usuario,
      ds_Email: row.ds_Email,
      nm_Usuario: row.nm_Usuario,
    }));
  }

  /**
   * Versão alternativa usando relations do TypeORM (mais simples, mas menos controle)
   */
  async carregarDadosUsuarioValidacaoV2(
    tipo: number,
    usuario: string,
  ): Promise<UsuarioValidacaoDto[]> {
    const whereCondition =
      tipo === 1
        ? { dsUsuario: usuario }
        : { dsEmail: usuario };

    const logins = await this.loginRepository.find({
      where: {
        ...whereCondition,
        usuario: {
          flExcluido: 'N',
          cliente: {
            empresa: {
              flExcluido: 0,
              flAtivo: 1,
            },
          },
        },
      },
      relations: ['usuario', 'usuario.cliente', 'usuario.cliente.empresa'],
      order: {
        usuario: {
          cliente: {
            empresa: {
              nmFantasia: 'ASC',
            },
          },
        },
      },
    });

    return logins.map((login) => ({
      id_Empresa: login.usuario.cliente.empresa.idEmpresa,
      nm_Empresa: login.usuario.cliente.empresa.nmFantasia,
      id_Cliente: login.usuario.cliente.idCliente,
      id_Usuario: login.usuario.idUsuario,
      fl_Primeiro_Acesso: login.flPrimeiroAcesso,
      dt_Ultima_Senha: login.dtUltimaSenha,
      ds_Usuario: login.dsUsuario,
      ds_Email: login.dsEmail,
      nm_Usuario: login.usuario.nmUsuario,
    }));
  }

  /**
   * Método equivalente ao ValidaLogin do C#
   * @param tipo 1 = busca por ds_Usuario, 2 = busca por ds_Email
   * @param usuario Nome de usuário ou email
   * @returns Objeto LoginDto com os dados do login ou null se não encontrar
   */
  async validaLogin(tipo: number, usuario: string): Promise<LoginDto | null> {
    const queryBuilder = this.loginRepository
      .createQueryBuilder('L')
      .innerJoin('L.usuario', 'U')
      .select([
        'U.Id_Cliente as id_Cliente',
        'L.Id_Usuario as id_Usuario',
        'L.ds_Usuario as ds_Usuario',
        'L.ds_Email as ds_Email',
        'L.ds_Password as ds_Password',
        'U.fl_Excluido as fl_Excluido',
      ])
      .where('U.fl_Excluido = :flExcluido', { flExcluido: 'N' });

    // Aplica condição baseada no tipo
    if (tipo === 1) {
      queryBuilder.andWhere('L.ds_Usuario = :usuario', { usuario });
    } else {
      queryBuilder.andWhere('L.ds_Email = :usuario', { usuario });
    }

    const result = await queryBuilder.getRawOne();

    // Se não encontrou, retorna null (equivalente ao comportamento do C#)
    if (!result) {
      return null;
    }

    // Mapeia o resultado para o DTO (apenas os campos necessários)
    return {
      id_Usuario: result.id_Usuario,
      ds_Password: result.ds_Password,
      id_Cliente: result.id_Cliente,
      ds_Email: result.ds_Email,
    };
  }

  /**
   * Método equivalente ao CarregarDadosUsuario do C#
   * @param usuario ID do usuário
   * @returns Objeto UsuarioDto com os dados completos do usuário ou null se não encontrar
   */
  async carregarDadosUsuario(usuario: number): Promise<UsuarioDto | null> {
    const queryBuilder = this.usuarioRepository
      .createQueryBuilder('U')
      .innerJoin(Login, 'L', 'U.Id_Usuario = L.Id_Usuario')
      .leftJoin(UsuarioControle, 'UC', 'U.Id_Usuario = UC.id_Usuario')
      .innerJoin(UsuarioXPermissao, 'P', 'U.Id_Usuario = P.Id_Usuario')
      .innerJoin(Cargo, 'C', 'U.Id_Cargo = C.Id_Cargo')
      .innerJoin(Departamento, 'D', 'U.Id_Departamento = D.Id_Departamento')
      .innerJoin(PermissaoUsuarioXSubGrupo, 'G', 'U.Id_Usuario = G.Id_Usuario')
      .innerJoin(GrupoAcessoUsuario, 'O', 'G.Id_GrupoAcessoUsuario = O.Id_GrupoAcessoUsuario')
      .innerJoin(Cliente, 'CL', 'U.Id_Cliente = CL.Id_Cliente')
      .innerJoin(Empresa, 'E', 'CL.Id_Empresa = E.Id_Empresa')
      .leftJoin(AcessoUsuario, 'AC', 'U.Id_Usuario = AC.Id_Usuario')
      .select([
        'CL.Id_Empresa as id_Empresa',
        'CL.Id_Cliente as id_Cliente',
        'CL.nm_Fantasia as nm_Fantasia',
        'CL.Id_Matriz as id_Matriz',
        'CL.fl_Filial as fl_Filial',
        'CL.fl_MultiAcesso as fl_MultiAcessoCliente',
        'CL.fl_Mascarar_Campos_Lgpd as fl_Mascarar_Campos_Lgpd',
        'CL.fl_Higienizacao_Lead as fl_Higienizacao_Lead',
        'CL.fl_Sobre_Lead as fl_Sobre_Lead',
        'U.fl_Adm as fl_Adm',
        'U.Id_Usuario as id_Usuario',
        'U.nm_Usuario as nm_Usuario',
        'U.fl_MultiAcesso as fl_MultiAcesso',
        'L.ds_Usuario as ds_Usuario',
        'L.ds_Email as ds_Email',
        'L.ds_Password as ds_Password',
        'L.dt_Ultima_Senha as dt_Ultima_Senha',
        'L.nu_Erro_Senha as nu_Erro_Senha',
        'D.ds_Departamento as ds_Departamento',
        'C.ds_Cargo as ds_Cargo',
        'C.tp_Cargo as tp_Cargo',
        'G.Id_GrupoAcessoUsuario as id_GrupoAcessoUsuario',
        'O.id_ordem as id_ordem',
        'U.st_Usuario as st_Usuario',
        'U.hs_AcessoInicial as hs_AcessoInicial',
        'U.hs_AcessoFinal as hs_AcessoFinal',
        'U.fl_Excluido as fl_Excluido',
        'AC.ds_IP as ds_IP',
        'P.fl_Supervisao as fl_Supervisao',
        'P.fl_Alterar_Lead as fl_Alterar_Lead',
        'E.nu_DDI as nu_DDI',
        'P.fl_PermitirCaptura as fl_PermitirCaptura',
        'P.fl_PermitirChat as fl_PermitirChat',
        'P.fl_PermitirReceptivo as fl_PermitirReceptivo',
        'P.fl_PermitirRetornoMkt as fl_PermitirRetornoMkt',
        'P.fl_PermitirTarefa as fl_PermitirTarefa',
        'P.fl_LogarSemRamal as fl_LogarSemRamal',
        'P.fl_ControleHorario as fl_ControleHorario',
        'P.fl_LogoutAutomatico as fl_LogoutAutomatico',
        'P.fl_ExcluirMemoriaAtendimento as fl_ExcluirMemoriaAtendimento',
        'P.fl_VisualizarCamposLgpd as fl_VisualizarCamposLgpd',
        'P.fl_HigienizarLead as fl_HigienizarLead',
        'P.fl_UtilizaGravacao as fl_UtilizaGravacao',
        'P.fl_PopUpRetorno as fl_PopUpRetorno',
        'U.tp_Acesso as tp_Acesso',
        'UC.id_Projeto as id_Projeto',
        'U.tp_Funil as tp_Funil',
        'U.ds_Funil as ds_Funil',
      ])
      .where('U.Id_Usuario = :usuario', { usuario })
      .groupBy(
        [
          'CL.Id_Empresa',
          'CL.Id_Cliente',
          'CL.nm_Fantasia',
          'CL.Id_Matriz',
          'CL.fl_Filial',
          'CL.fl_MultiAcesso',
          'CL.fl_Mascarar_Campos_Lgpd',
          'CL.fl_Higienizacao_Lead',
          'CL.fl_Sobre_Lead',
          'U.fl_Adm',
          'U.Id_Usuario',
          'U.nm_Usuario',
          'U.fl_MultiAcesso',
          'L.ds_Usuario',
          'L.ds_Email',
          'L.ds_Password',
          'L.dt_Ultima_Senha',
          'L.nu_Erro_Senha',
          'D.ds_Departamento',
          'C.ds_Cargo',
          'C.tp_Cargo',
          'G.Id_GrupoAcessoUsuario',
          'O.id_ordem',
          'U.st_Usuario',
          'U.hs_AcessoInicial',
          'U.hs_AcessoFinal',
          'U.fl_Excluido',
          'AC.ds_IP',
          'P.fl_Supervisao',
          'P.fl_Alterar_Lead',
          'E.nu_DDI',
          'P.fl_PermitirCaptura',
          'P.fl_PermitirChat',
          'P.fl_PermitirReceptivo',
          'P.fl_PermitirRetornoMkt',
          'P.fl_PermitirTarefa',
          'P.fl_LogarSemRamal',
          'P.fl_ControleHorario',
          'P.fl_LogoutAutomatico',
          'P.fl_ExcluirMemoriaAtendimento',
          'P.fl_VisualizarCamposLgpd',
          'P.fl_HigienizarLead',
          'P.fl_UtilizaGravacao',
          'P.fl_PopUpRetorno',
          'U.tp_Acesso',
          'UC.id_Projeto',
          'U.tp_Funil',
          'U.ds_Funil',
        ].join(', ')
      );

    const result = await queryBuilder.getRawOne();

    // Se não encontrou, retorna null (equivalente ao comportamento do C#)
    if (!result) {
      return null;
    }

    // Mapeia o resultado para o DTO
    return {
      nu_DDI: result.nu_DDI,
      id_Empresa: result.id_Empresa,
      id_Cliente: result.id_Cliente,
      nm_Fantasia: result.nm_Fantasia,
      id_Matriz: result.id_Matriz,
      fl_Filial: result.fl_Filial === 1 || result.fl_Filial === true,
      fl_MultiAcessoCliente: result.fl_MultiAcessoCliente === 1 || result.fl_MultiAcessoCliente === true,
      fl_Mascarar_Campos_Lgpd: result.fl_Mascarar_Campos_Lgpd === 1 || result.fl_Mascarar_Campos_Lgpd === true,
      fl_Higienizacao_Lead: result.fl_Higienizacao_Lead === 1 || result.fl_Higienizacao_Lead === true,
      fl_Sobre_Lead: result.fl_Sobre_Lead === 1 || result.fl_Sobre_Lead === true,
      fl_MultiAcesso: result.fl_MultiAcesso === 1 || result.fl_MultiAcesso === true,
      id_Usuario: result.id_Usuario,
      nm_Usuario: result.nm_Usuario,
      fl_Adm: result.fl_Adm === 1 || result.fl_Adm === true,
      ds_Usuario: result.ds_Usuario,
      ds_Email: result.ds_Email,
      ds_Password: result.ds_Password,
      dt_Ultima_Senha: result.dt_Ultima_Senha,
      nu_Erro_Senha: result.nu_Erro_Senha || undefined,
      ds_Departamento: result.ds_Departamento,
      tp_Cargo: result.tp_Cargo,
      ds_Cargo: result.ds_Cargo,
      fl_Excluido: result.fl_Excluido,
      st_Usuario: result.st_Usuario,
      hr_AcessoInicial: result.hs_AcessoInicial,
      hr_AcessoFinal: result.hs_AcessoFinal,
      ds_IP: result.ds_IP || '',
      fl_Supervisao: result.fl_Supervisao === 1 || result.fl_Supervisao === true,
      fl_Alterar_Lead: result.fl_Alterar_Lead === 1 || result.fl_Alterar_Lead === true,
      fl_PermitirChat: result.fl_PermitirChat === 1 || result.fl_PermitirChat === true,
      fl_PermitirRetornoMkt: result.fl_PermitirRetornoMkt === 1 || result.fl_PermitirRetornoMkt === true,
      fl_PermitirReceptivo: result.fl_PermitirReceptivo === 1 || result.fl_PermitirReceptivo === true,
      fl_PermitirCaptura: result.fl_PermitirCaptura === 1 || result.fl_PermitirCaptura === true,
      fl_PermitirTarefa: result.fl_PermitirTarefa === 1 || result.fl_PermitirTarefa === true,
      fl_LogarSemRamal: result.fl_LogarSemRamal === 1 || result.fl_LogarSemRamal === true,
      fl_ControleHorario: result.fl_ControleHorario === 1 || result.fl_ControleHorario === true,
      fl_LogoutAutomatico: result.fl_LogoutAutomatico === 1 || result.fl_LogoutAutomatico === true,
      fl_ExcluirMemoriaAtendimento: result.fl_ExcluirMemoriaAtendimento === 1 || result.fl_ExcluirMemoriaAtendimento === true,
      fl_VisualizarCamposLgpd: result.fl_VisualizarCamposLgpd === 1 || result.fl_VisualizarCamposLgpd === true,
      fl_HigienizarLead: result.fl_HigienizarLead === 1 || result.fl_HigienizarLead === true,
      fl_GravarAtendimento: result.fl_UtilizaGravacao === 1 || result.fl_UtilizaGravacao === true,
      fl_PopUpRetorno: result.fl_PopUpRetorno === 1 || result.fl_PopUpRetorno === true,
      id_GrupoAcessoUsuario: result.id_GrupoAcessoUsuario,
      nu_Ordem: result.id_ordem,
      tp_Acesso: result.tp_Acesso,
      id_Projeto: result.id_Projeto || undefined,
      tp_Funil: result.tp_Funil,
      ds_Funil: result.ds_Funil,
    };
  }

  /**
   * Método equivalente ao AtualizaErroSenha do C#
   * @param usuario ID do usuário
   * @param erro Se true, incrementa nu_Erro_Senha em 1; se false, define como 0
   * @returns true se atualizado com sucesso, false em caso de erro
   */
  async atualizaErroSenha(usuario: number, erro: boolean): Promise<boolean> {
    try {
      const queryBuilder = this.loginRepository
        .createQueryBuilder()
        .update(Login)
        .where('Id_Usuario = :usuario', { usuario });

      if (erro === true) {
        // Incrementa nu_Erro_Senha em 1
        queryBuilder.set({ nuErroSenha: () => 'nuErroSenha + 1' });
      } else {
        // Define nu_Erro_Senha como 0
        queryBuilder.set({ nuErroSenha: 0 });
      }

      const result = await queryBuilder.execute();

      // Retorna true se pelo menos uma linha foi afetada
      return result.affected !== undefined && result.affected > 0;
    } catch (error) {
      // Em caso de erro, retorna false (equivalente ao comportamento do C#)
      console.error('Erro ao atualizar erro de senha:', error);
      return false;
    }
  }

  /**
   * Método equivalente ao VerificaCodigoAutenticacaoUsuarioExiste do C#
   * @param empresa ID da empresa
   * @param usuario ID do usuário
   * @returns true se existe código de autenticação, false caso contrário
   */
  async verificaCodigoAutenticacaoUsuarioExiste(
    empresa: number,
    usuario: number,
  ): Promise<boolean> {
    try {
      const count = await this.usuarioAutenticacaoRepository
        .createQueryBuilder('UA')
        .where('UA.id_Empresa = :empresa', { empresa })
        .andWhere('UA.id_Usuario = :usuario', { usuario })
        .getCount();

      // Retorna true se count > 0 (equivalente ao comportamento do C#)
      return count > 0;
    } catch (error) {
      // Em caso de erro, retorna false (equivalente ao comportamento do C#)
      console.error('Erro ao verificar código de autenticação:', error);
      return false;
    }
  }

  /**
   * Método equivalente ao CarregarDadosCodigoAutenticacao do C#
   * @param empresa ID da empresa
   * @param usuario ID do usuário
   * @returns Objeto AutenticacaoDto com os dados do código de autenticação ou null se não encontrar
   */
  async carregarDadosCodigoAutenticacao(
    empresa: number,
    usuario: number,
  ): Promise<AutenticacaoDto | null> {
    try {
      const queryBuilder = this.usuarioAutenticacaoRepository
        .createQueryBuilder('UA')
        .select([
          'UA.dt_Modificacao as dt_Modificacao',
          'UA.id_Empresa as id_Empresa',
          'UA.id_Usuario as id_Usuario',
          'UA.ds_Codigo as ds_Codigo',
        ])
        .where('UA.id_Empresa = :empresa', { empresa })
        .andWhere('UA.id_Usuario = :usuario', { usuario });

      const result = await queryBuilder.getRawOne();

      // Se não encontrou, retorna null (equivalente ao comportamento do C#)
      if (!result) {
        return null;
      }

      // Mapeia o resultado para o DTO
      return {
        dt_Modificacao: result.dt_Modificacao,
        id_Empresa: result.id_Empresa,
        id_Usuario: result.id_Usuario,
        ds_Codigo: result.ds_Codigo,
      };
    } catch (error) {
      // Em caso de erro, retorna null (equivalente ao comportamento do C#)
      console.error('Erro ao carregar dados do código de autenticação:', error);
      return null;
    }
  }

  /**
   * Método equivalente ao ArmazenaCodigoAutenticacaoUsuario do C#
   * @param empresa ID da empresa
   * @param usuario ID do usuário
   * @param codigo Código de autenticação
   * @param atualizar Se true, atualiza registro existente; se false, insere novo registro
   * @returns true se operação foi bem-sucedida, false em caso de erro
   */
  async armazenaCodigoAutenticacaoUsuario(
    empresa: number,
    usuario: number,
    codigo: string,
    atualizar: boolean,
  ): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const data = new Date();

      if (atualizar === false) {
        // INSERT
        const novoRegistro = queryRunner.manager.create(UsuarioAutenticacao, {
          dtCriacao: data,
          dtModificacao: data,
          idEmpresa: empresa,
          idUsuario: usuario,
          dsCodigo: codigo,
        });

        await queryRunner.manager.save(novoRegistro);
      } else {
        // UPDATE
        const result = await queryRunner.manager
          .createQueryBuilder()
          .update(UsuarioAutenticacao)
          .set({
            dtModificacao: data,
            dsCodigo: codigo,
          })
          .where('id_Empresa = :empresa', { empresa })
          .andWhere('id_Usuario = :usuario', { usuario })
          .execute();

        // Verifica se pelo menos uma linha foi afetada
        if (result.affected === 0) {
          throw new Error('Nenhum registro encontrado para atualizar');
        }
      }

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao armazenar código de autenticação:', error);
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Método equivalente ao CarregaParametrosEmail do C#
   * @returns Objeto EmailDto com os parâmetros de email ou null se não encontrar
   */
  async carregaParametrosEmail(): Promise<EmailDto | null> {
    try {
      const queryBuilder = this.emailRepository
        .createQueryBuilder('E')
        .select([
          'E.ds_Email as ds_Email',
          'E.ds_Smtp as ds_Smtp',
          'E.nu_Porta_Smtp as nu_Porta_Smtp',
          'E.fl_SSL as fl_SSL',
          'E.ds_Nome_Saida as ds_Nome_Saida',
          'E.ds_Email_Saida as ds_Email_Saida',
          'E.ds_Email_Resposta as ds_Email_Resposta',
          'E.ds_Usuario as ds_Usuario',
          'E.ds_Password as ds_Password',
          'E.ds_Token as ds_Token',
        ]);

      const result = await queryBuilder.getRawOne();

      // Se não encontrou, retorna null (equivalente ao comportamento do C#)
      if (!result) {
        return null;
      }

      // Mapeia o resultado para o DTO
      return {
        ds_Email: result.ds_Email,
        ds_Smtp: result.ds_Smtp,
        nu_Porta_Smtp: result.nu_Porta_Smtp,
        fl_SSL: result.fl_SSL === 1 || result.fl_SSL === true,
        ds_Nome_Saida: result.ds_Nome_Saida,
        ds_Email_Saida: result.ds_Email_Saida,
        ds_Email_Resposta: result.ds_Email_Resposta,
        ds_Usuario: result.ds_Usuario,
        ds_Password: result.ds_Password,
        ds_Token: result.ds_Token,
      };
    } catch (error) {
      // Em caso de erro, retorna null (equivalente ao comportamento do C#)
      console.error('Erro ao carregar parâmetros de email:', error);
      return null;
    }
  }

  /**
   * Método equivalente ao VerificaNomeUsuarioExiste do C#
   * @param empresa ID da empresa
   * @param usuario ID do usuário (usado apenas para log de erro)
   * @param nome Nome de usuário a verificar
   * @returns true se o nome de usuário já existe, false caso contrário
   */
  async verificaNomeUsuarioExiste(
    empresa: number,
    usuario: number,
    nome: string,
  ): Promise<boolean> {
    try {
      const count = await this.loginRepository
        .createQueryBuilder('L')
        .innerJoin('L.usuario', 'U')
        .innerJoin('U.cliente', 'C')
        .where('C.Id_Empresa = :empresa', { empresa })
        .andWhere('L.ds_Usuario = :nomeUsuario', { nomeUsuario: nome })
        .getCount();

      // Retorna true se count > 0 (equivalente ao comportamento do C#)
      return count > 0;
    } catch (error) {
      // Em caso de erro, retorna false (equivalente ao comportamento do C#)
      console.error('Erro ao verificar nome de usuário:', error);
      return false;
    }
  }

  /**
   * Método equivalente ao VerificaSenhaUsadaAnteriormente do C#
   * @param usuario ID do usuário
   * @param senha Senha a verificar
   * @returns true se a senha já foi usada anteriormente, false caso contrário
   */
  async verificaSenhaUsadaAnteriormente(
    usuario: number,
    senha: string,
  ): Promise<boolean> {
    try {
      const count = await this.historicoSenhaRepository
        .createQueryBuilder('HS')
        .where('HS.id_Usuario = :usuario', { usuario })
        .andWhere('HS.ds_Password = :senha', { senha })
        .getCount();

      // Retorna true se count > 0 (equivalente ao comportamento do C#)
      return count > 0;
    } catch (error) {
      // Em caso de erro, retorna false (equivalente ao comportamento do C#)
      console.error('Erro ao verificar senha usada anteriormente:', error);
      return false;
    }
  }

  /**
   * Método equivalente ao SalvarSenhaUsuario do C#
   * @param empresa ID da empresa (usado apenas para log de erro)
   * @param usuario ID do usuário
   * @param nome_usuario Nome de usuário (opcional, pode ser null ou vazio)
   * @param senha Nova senha
   * @param primeiro_acesso Se true, define fl_Primeiro_Acesso = 0
   * @returns true se operação foi bem-sucedida, false em caso de erro
   */
  async salvarSenhaUsuario(
    empresa: number,
    usuario: number,
    nome_usuario: string | null,
    senha: string,
    primeiro_acesso: boolean,
  ): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const data = new Date();

      // UPDATE na tabela security.tbl_Login
      // Usa o nome da tabela diretamente para incluir dt_Modificacao que pode não estar na entidade
      const updateBuilder = queryRunner.manager
        .createQueryBuilder()
        .update('security.tbl_Login')
        .set({
          'dt_Modificacao': data,
          'dt_Ultima_Senha': data,
          'nu_Erro_Senha': 0,
          'ds_Password': senha,
        })
        .where('Id_Usuario = :usuario', { usuario });

      // Adiciona campos condicionais usando set() adicional
      if (primeiro_acesso === true) {
        updateBuilder.set({ 'fl_Primeiro_Acesso': 0 });
      }

      if (nome_usuario && nome_usuario.trim() !== '') {
        updateBuilder.set({ 'ds_Usuario': nome_usuario });
      }

      const updateResult = await updateBuilder.execute();

      // Verifica se pelo menos uma linha foi afetada
      if (updateResult.affected === 0) {
        throw new Error('Nenhum registro encontrado para atualizar');
      }

      // INSERT na tabela security.tbl_HistoricoSenha
      const novoHistorico = queryRunner.manager.create(HistoricoSenha, {
        dtCriacao: data,
        idUsuario: usuario,
        dsPassword: senha,
      });

      await queryRunner.manager.save(novoHistorico);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao salvar senha do usuário:', error);
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Método equivalente ao RegistroLogAcessoCelular do C#
   * @param usuario ID do usuário
   * @param cliente ID do cliente
   * @param ip Endereço IP do acesso
   * @param data Data e hora do acesso
   * @param info Informações adicionais do acesso
   * @returns true se operação foi bem-sucedida, false em caso de erro
   */
  async registroLogAcessoCelular(
    usuario: number,
    cliente: number,
    ip: string,
    data: Date,
    info: string,
  ): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // INSERT na tabela Logapp.tbl_AcessoUsuarioCelular
      const novoAcesso = queryRunner.manager.create(AcessoUsuarioCelular, {
        dtData: data,
        idUsuario: usuario,
        dsIP: ip,
        dsInfo: info,
        idCliente: cliente,
      });

      await queryRunner.manager.save(novoAcesso);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao registrar log de acesso celular:', error);
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Método equivalente ao RegistroLogAcessoUsuario do C#
   * @param usuario ID do usuário
   * @param cliente ID do cliente
   * @param ip Endereço IP do acesso
   * @param data Data e hora do acesso
   * @returns true se operação foi bem-sucedida, false em caso de erro
   */
  async registroLogAcessoUsuario(
    usuario: number,
    cliente: number,
    ip: string,
    data: Date,
  ): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // INSERT na tabela Logapp.tbl_AcessoUsuario
      const novoAcesso = queryRunner.manager.create(AcessoUsuario, {
        dtData: data,
        idUsuario: usuario,
        dsIP: ip,
        idCliente: cliente,
      });

      await queryRunner.manager.save(novoAcesso);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao registrar log de acesso do usuário:', error);
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Método equivalente ao VerificaQuantidadeLogoutIncorreto do C#
   * @param usuario ID do usuário
   * @param cliente ID do cliente (usado apenas para log de erro, não na query)
   * @returns Número de acessos com logout incorreto (count > 0) ou 0 se não houver
   */
  async verificaQuantidadeLogoutIncorreto(
    usuario: number,
    cliente: number,
  ): Promise<number> {
    try {
      const count = await this.usuarioAcessoRepository
        .createQueryBuilder('UA')
        .where('UA.id_Usuario = :usuario', { usuario })
        .andWhere('UA.fl_Logout = :flLogout', { flLogout: 0 })
        .andWhere('UA.fl_Bloqueado = :flBloqueado', { flBloqueado: 1 })
        .getCount();

      // Retorna o count se > 0, senão retorna 0 (equivalente ao comportamento do C#)
      return count > 0 ? count : 0;
    } catch (error) {
      // Em caso de erro, retorna 0 (equivalente ao comportamento do C#)
      console.error('Erro ao verificar quantidade de logout incorreto:', error);
      return 0;
    }
  }

  /**
   * Método equivalente ao BloqueioHorarioInvalidoUsuario do C#
   * @param usuario ID do usuário
   * @param cliente ID do cliente (usado apenas para log de erro)
   * @returns true se operação foi bem-sucedida, false em caso de erro
   */
  async bloqueioHorarioInvalidoUsuario(
    usuario: number,
    cliente: number,
  ): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // UPDATE na tabela security.tbl_UsuarioAcesso
      const updateResult = await queryRunner.manager
        .createQueryBuilder()
        .update(UsuarioAcesso)
        .set({ flBloqueado: true })
        .where('id_Usuario = :usuario', { usuario })
        .andWhere('fl_Logout = :flLogout', { flLogout: 0 })
        .andWhere('dt_Logout IS NULL')
        .execute();

      await queryRunner.commitTransaction();
      
      // Retorna true se pelo menos uma linha foi afetada (equivalente ao comportamento do C#)
      return updateResult.affected !== undefined && updateResult.affected >= 0;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao bloquear horário inválido do usuário:', error);
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Método equivalente ao CarregarPausas do C#
   * @param usuario ID do usuário (usado apenas para log de erro)
   * @param cliente ID do cliente (usado apenas para log de erro)
   * @param empresa ID da empresa
   * @returns Array de PausaDto com as pausas disponíveis
   */
  async carregarPausas(
    usuario: number,
    cliente: number,
    empresa: number,
  ): Promise<PausaDto[]> {
    try {
      const queryBuilder = this.usuarioPausaRepository
        .createQueryBuilder('UP')
        .select([
          'UP.id_Empresa as id_Empresa',
          'UP.id_Pausa as id_Pausa',
          'UP.ds_Pausa as ds_Pausa',
        ])
        .where('UP.id_Empresa = :empresa', { empresa })
        .andWhere('UP.fl_Excluiu = :flExcluiu', { flExcluiu: 'N' })
        .andWhere('UP.fl_Ativo = :flAtivo', { flAtivo: 1 })
        .orderBy('UP.ds_Pausa', 'ASC');

      const results = await queryBuilder.getRawMany();

      // Mapeia os resultados para o DTO
      return results.map((row) => ({
        id_Empresa: row.id_Empresa,
        id_Pausa: row.id_Pausa,
        ds_Pausa: row.ds_Pausa,
      }));
    } catch (error) {
      // Em caso de erro, retorna array vazio (equivalente ao comportamento do C#)
      console.error('Erro ao carregar pausas:', error);
      return [];
    }
  }

  /**
   * Método equivalente ao RegistraLogControleHorario do C#
   * @param usuario ID do usuário
   * @param cliente ID do cliente (usado apenas para log de erro)
   * @param acesso Tipo de acesso (se == 3, será null)
   * @param projeto ID do projeto
   * @param data Data e hora do login
   * @returns ID do registro inserido ou 0 em caso de erro
   */
  async registraLogControleHorario(
    usuario: number,
    cliente: number,
    acesso: number,
    projeto: number,
    data: Date,
  ): Promise<number> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Prepara os dados para inserção
      const dadosInsert: any = {
        idUsuario: usuario,
        idProjeto: projeto,
        tpLogin: 1,
        dtLogin: data,
      };

      // Se acesso != 3, adiciona tp_Acesso, senão deixa null
      if (acesso !== 3) {
        dadosInsert.tpAcesso = acesso;
      } else {
        dadosInsert.tpAcesso = null;
      }

      // INSERT na tabela security.tbl_UsuarioAcesso
      const novoAcesso = queryRunner.manager.create(UsuarioAcesso, dadosInsert);
      const acessoSalvo = await queryRunner.manager.save(novoAcesso);

      await queryRunner.commitTransaction();

      // Retorna o ID do registro inserido (equivalente ao SCOPE_IDENTITY() do C#)
      return acessoSalvo.idAcesso || 0;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao registrar log de controle de horário:', error);
      // Em caso de erro, retorna 0 (equivalente ao comportamento do C#)
      return 0;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Método equivalente ao CarregarListaClientesMenu do C#
   * @param usuario ID do usuário
   * @param matriz ID da matriz (cliente matriz a ser excluído da lista)
   * @returns Array de ClienteMenuDto com os clientes disponíveis para o menu
   */
  async carregarListaClientesMenu(
    usuario: number,
    matriz: number,
  ): Promise<ClienteMenuDto[]> {
    try {
      const queryBuilder = this.usuarioMultiAcessoRepository
        .createQueryBuilder('M')
        .innerJoin('M.cliente', 'C')
        .select([
          'M.Id_Cliente as id_Cliente',
          'C.nm_Fantasia as nm_Fantasia',
          'M.Id_Usuario as id_Usuario',
        ])
        .where('M.Id_Usuario = :usuario', { usuario })
        .andWhere('C.fl_Excluido = :flExcluido', { flExcluido: 'N' })
        .andWhere('C.fl_Filial = :flFilial', { flFilial: 0 })
        .andWhere('C.Id_Cliente <> :matriz', { matriz })
        .orderBy('C.nm_Fantasia', 'ASC');

      const results = await queryBuilder.getRawMany();

      // Mapeia os resultados para o DTO
      return results.map((row) => ({
        id_Cliente: row.id_Cliente,
        nm_Fantasia: row.nm_Fantasia,
        id_Usuario: row.id_Usuario,
      }));
    } catch (error) {
      // Em caso de erro, retorna array vazio (equivalente ao comportamento do C#)
      console.error('Erro ao carregar lista de clientes do menu:', error);
      return [];
    }
  }

  /**
   * Método equivalente ao CarregarModulos do C#
   * @param usuario ID do usuário
   * @param cliente ID do cliente
   * @returns Array de MenuDto com os módulos disponíveis
   */
  async carregarModulos(
    usuario: number,
    cliente: number,
  ): Promise<MenuDto[]> {
    try {
      // Subquery para filtrar módulos do cliente
      const subquery = this.dataSource
        .createQueryBuilder(ModuloXCliente, 'MXC')
        .select('MXC.idModulo', 'idModulo')
        .where('MXC.idCliente = :cliente', { cliente });

      const queryBuilder = this.permissaoUsuarioXSubGrupoRepository
        .createQueryBuilder('A')
        .innerJoin(SubGrupo, 'S', 'A.idSubGrupo = S.idSubGrupo')
        .innerJoin(Grupo, 'G', 'S.idGrupo = G.idGrupo')
        .innerJoin(Modulo, 'M', 'G.idModulo = M.idModulo')
        .innerJoin(
          `(${subquery.getQuery()})`,
          'C',
          'G.idModulo = C.idModulo',
        )
        .innerJoin(GrupoAcessoUsuario, 'P', 'A.idGrupoAcessoUsuario = P.idGrupoAcessoUsuario')
        .select([
          'A.idUsuario as id_Usuario',
          'G.idModulo as id_Modulo',
          'M.dsModulo as ds_Modulo',
          'M.icModulo as ic_Modulo',
        ])
        .where('A.idUsuario = :usuario', { usuario })
        .andWhere('M.flExcluiu = :flExcluiuModulo', { flExcluiuModulo: 'N' })
        .andWhere('G.flExcluiu = :flExcluiuGrupo', { flExcluiuGrupo: 'N' })
        .andWhere('S.flExcluiu = :flExcluiuSubGrupo', { flExcluiuSubGrupo: 'N' })
        .groupBy('A.idUsuario, G.idModulo, M.dsModulo, M.icModulo')
        .orderBy('M.dsModulo', 'ASC');

      // Adiciona os parâmetros da subquery
      queryBuilder.setParameters(subquery.getParameters());

      const results = await queryBuilder.getRawMany();

      // Mapeia os resultados para o DTO
      return results.map((row) => ({
        id_Usuario: row.id_Usuario,
        id_Modulo: row.id_Modulo,
        ds_Modulo: row.ds_Modulo,
        ic_Modulo: row.ic_Modulo,
      }));
    } catch (error) {
      // Em caso de erro, retorna array vazio (equivalente ao comportamento do C#)
      console.error('Erro ao carregar módulos:', error);
      return [];
    }
  }

  /**
   * Método equivalente ao CarregarGrupos do C#
   * @param usuario ID do usuário
   * @param modulo ID do módulo
   * @returns Array de MenuDto com os grupos disponíveis
   */
  async carregarGrupos(
    usuario: number,
    modulo: number,
  ): Promise<MenuDto[]> {
    try {
      const queryBuilder = this.permissaoUsuarioXSubGrupoRepository
        .createQueryBuilder('A')
        .innerJoin('global.tbl_SubGrupo', 'S', 'A.Id_SubGrupo = S.Id_SubGrupo')
        .innerJoin('global.tbl_Grupo', 'G', 'S.Id_Grupo = G.Id_Grupo')
        .innerJoin('global.tbl_Modulo', 'M', 'G.Id_Modulo = M.Id_Modulo')
        .innerJoin('security.tbl_GrupoAcessoUsuario', 'P', 'A.Id_GrupoAcessoUsuario = P.Id_GrupoAcessoUsuario')
        .select([
          'A.Id_Usuario as id_Usuario',
          'G.Id_Modulo as id_Modulo',
          'S.Id_Grupo as id_Grupo',
          'G.ds_Grupo as ds_Grupo',
          'G.ic_Grupo as ic_Grupo',
        ])
        .where('A.Id_Usuario = :usuario', { usuario })
        .andWhere('G.Id_Modulo = :modulo', { modulo })
        .andWhere('M.fl_Excluiu = :flExcluiuModulo', { flExcluiuModulo: 'N' })
        .andWhere('G.fl_Excluiu = :flExcluiuGrupo', { flExcluiuGrupo: 'N' })
        .andWhere('S.fl_Excluiu = :flExcluiuSubGrupo', { flExcluiuSubGrupo: 'N' })
        .groupBy('A.Id_Usuario, G.Id_Modulo, S.Id_Grupo, G.ds_Grupo, G.ic_Grupo')
        .orderBy('G.ds_Grupo', 'ASC');

      const results = await queryBuilder.getRawMany();

      // Mapeia os resultados para o DTO
      return results.map((row) => ({
        id_Usuario: row.id_Usuario,
        id_Modulo: row.id_Modulo,
        id_Grupo: row.id_Grupo,
        ds_Grupo: row.ds_Grupo,
        ic_Grupo: row.ic_Grupo,
      }));
    } catch (error) {
      // Em caso de erro, retorna array vazio (equivalente ao comportamento do C#)
      console.error('Erro ao carregar grupos:', error);
      return [];
    }
  }

  /**
   * Método equivalente ao CarregarSubGrupos do C#
   * @param usuario ID do usuário
   * @param grupo ID do grupo
   * @returns Array de MenuDto com os subgrupos disponíveis
   */
  async carregarSubGrupos(
    usuario: number,
    grupo: number,
  ): Promise<MenuDto[]> {
    try {
      const queryBuilder = this.permissaoUsuarioXSubGrupoRepository
        .createQueryBuilder('A')
        .innerJoin('global.tbl_SubGrupo', 'S', 'A.Id_SubGrupo = S.Id_SubGrupo')
        .innerJoin('global.tbl_Grupo', 'G', 'S.Id_Grupo = G.Id_Grupo')
        .innerJoin('global.tbl_Modulo', 'M', 'G.Id_Modulo = M.Id_Modulo')
        .innerJoin('security.tbl_GrupoAcessoUsuario', 'P', 'A.Id_GrupoAcessoUsuario = P.Id_GrupoAcessoUsuario')
        .select([
          'A.Id_Usuario as id_Usuario',
          'S.Id_Grupo as id_Grupo',
          'A.Id_SubGrupo as id_SubGrupo',
          'S.ds_SubGrupo as ds_SubGrupo',
          'S.ds_Pasta as ds_Pasta',
          'S.ds_View as ds_View',
          'A.Id_GrupoAcessoUsuario as id_GrupoAcessoUsuario',
        ])
        .where('A.Id_Usuario = :usuario', { usuario })
        .andWhere('S.Id_Grupo = :grupo', { grupo })
        .andWhere('M.fl_Excluiu = :flExcluiuModulo', { flExcluiuModulo: 'N' })
        .andWhere('S.fl_Excluiu = :flExcluiuSubGrupo', { flExcluiuSubGrupo: 'N' })
        .orderBy('S.ds_SubGrupo', 'ASC');

      const results = await queryBuilder.getRawMany();

      // Mapeia os resultados para o DTO
      return results.map((row) => ({
        id_Usuario: row.id_Usuario,
        id_Grupo: row.id_Grupo,
        id_SubGrupo: row.id_SubGrupo,
        ds_SubGrupo: row.ds_SubGrupo,
        ds_Pasta: row.ds_Pasta,
        ds_View: row.ds_View,
        id_GrupoAcessoUsuario: row.id_GrupoAcessoUsuario,
      }));
    } catch (error) {
      // Em caso de erro, retorna array vazio (equivalente ao comportamento do C#)
      console.error('Erro ao carregar subgrupos:', error);
      return [];
    }
  }

  /**
   * Método equivalente ao CarregaPermissoes do C#
   * @param usuario ID do usuário (não usado na query, apenas para log de erro)
   * @param cliente ID do cliente (não usado na query, apenas para log de erro)
   * @param permissao ID do grupo de acesso (Id_GrupoAcessoUsuario)
   * @returns PermissaoDto com as permissões ou null se não encontrado
   */
  async carregaPermissoes(
    usuario: number,
    cliente: number,
    permissao: number,
  ): Promise<PermissaoDto | null> {
    try {
      const grupoAcesso = await this.grupoAcessoUsuarioRepository.findOne({
        where: {
          idGrupoAcessoUsuario: permissao,
        },
      });

      if (!grupoAcesso) {
        return null;
      }

      // Mapeia os resultados para o DTO
      return {
        fl_Incluir: Boolean(grupoAcesso.flIncluir),
        fl_Alterar: Boolean(grupoAcesso.flAlterar),
        fl_Excluir: Boolean(grupoAcesso.flExcluir),
        fl_Pesquisar: Boolean(grupoAcesso.flPesquisar),
      };
    } catch (error) {
      // Em caso de erro, retorna null (equivalente ao comportamento do C#)
      console.error('Erro ao carregar permissões:', error);
      return null;
    }
  }

  /**
   * Método equivalente ao CarregarDadosCliente do C#
   * @param usuario ID do usuário (não usado na query, apenas para log de erro)
   * @param cliente ID do cliente
   * @returns ClienteDto com os dados do cliente ou null se não encontrado
   */
  async carregarDadosCliente(
    usuario: number,
    cliente: number,
  ): Promise<ClienteDto | null> {
    try {
      const clienteEntity = await this.clienteRepository.findOne({
        where: {
          idCliente: cliente,
        },
      });

      if (!clienteEntity) {
        return null;
      }

      // Mapeia os resultados para o DTO
      return {
        id_Cliente: clienteEntity.idCliente,
        nm_Fantasia: clienteEntity.nmFantasia,
        id_Matriz: clienteEntity.idMatriz,
        fl_Filial: clienteEntity.flFilial === true,
        fl_Mascarar_Campos_Lgpd: clienteEntity.flMascararCamposLgpd === true,
        fl_Higienizacao_Lead: clienteEntity.flHigienizacaoLead === true,
        fl_Sobre_Lead: clienteEntity.flSobreLead === true,
      };
    } catch (error) {
      // Em caso de erro, retorna null (equivalente ao comportamento do C#)
      console.error('Erro ao carregar dados do cliente:', error);
      return null;
    }
  }

  /**
   * Método equivalente ao UpdateClienteLogAcessoUsuario do C#
   * @param usuario ID do usuário
   * @param cliente ID do cliente
   * @returns boolean indicando sucesso da operação
   */
  async updateClienteLogAcessoUsuario(
    usuario: number,
    cliente: number,
  ): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // UPDATE na tabela Logapp.tbl_AcessoUsuario
      const updateResult = await queryRunner.manager
        .createQueryBuilder()
        .update(AcessoUsuario)
        .set({ idCliente: cliente })
        .where('Id_Usuario = :usuario', { usuario })
        .execute();

      await queryRunner.commitTransaction();

      // Retorna true se pelo menos uma linha foi afetada (equivalente ao comportamento do C#)
      return updateResult.affected !== undefined && updateResult.affected > 0;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao atualizar cliente do log de acesso do usuário:', error);
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Método equivalente ao ExcluirLogAcessoUsuario do C#
   * @param usuario ID do usuário
   * @param cliente ID do cliente (não usado na query, apenas para log de erro)
   * @returns boolean indicando sucesso da operação
   */
  async excluirLogAcessoUsuario(
    usuario: number,
    cliente: number,
  ): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // DELETE na tabela Logapp.tbl_AcessoUsuario
      const deleteResult = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(AcessoUsuario)
        .where('Id_Usuario = :usuario', { usuario })
        .execute();

      await queryRunner.commitTransaction();

      // Retorna true se pelo menos uma linha foi afetada (equivalente ao comportamento do C#)
      return deleteResult.affected !== undefined && deleteResult.affected >= 0;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao excluir log de acesso do usuário:', error);
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Método equivalente ao RegistarLogoutControleHorario do C#
   * @param usuario ID do usuário (não usado na query, apenas para log de erro)
   * @param cliente ID do cliente (não usado na query, apenas para log de erro)
   * @param acesso ID do acesso (id_Acesso)
   * @param tipo_acesso Tipo de acesso (tp_Acesso)
   * @returns boolean indicando sucesso da operação
   */
  async registarLogoutControleHorario(
    usuario: number,
    cliente: number,
    acesso: number,
    tipo_acesso: number,
  ): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const data = new Date();

      // UPDATE na tabela security.tbl_UsuarioAcesso
      const updateResult = await queryRunner.manager
        .createQueryBuilder()
        .update(UsuarioAcesso)
        .set({
          flLogout: true,
          dtLogout: data,
          tpAcesso: tipo_acesso,
        })
        .where('id_Acesso = :acesso', { acesso })
        .execute();

      await queryRunner.commitTransaction();

      // Retorna true se pelo menos uma linha foi afetada (equivalente ao comportamento do C#)
      return updateResult.affected !== undefined && updateResult.affected > 0;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao registrar logout de controle de horário:', error);
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Método equivalente ao RegistrarIntervaloControleHorario do C#
   * @param usuario ID do usuário
   * @param cliente ID do cliente (não usado na query, apenas para log de erro)
   * @param projeto ID do projeto
   * @param acesso ID do acesso (id_Acesso)
   * @param tipo_acesso Tipo de acesso (tp_Acesso)
   * @returns IntervaloControleHorarioDto com sucesso, registro (ID inserido) e horario
   */
  async registrarIntervaloControleHorario(
    usuario: number,
    cliente: number,
    projeto: number,
    acesso: number,
    tipo_acesso: number,
  ): Promise<IntervaloControleHorarioDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const data = new Date();
    let registro = 0;

    try {
      // UPDATE na tabela security.tbl_UsuarioAcesso (Logout)
      const updateResult = await queryRunner.manager
        .createQueryBuilder()
        .update(UsuarioAcesso)
        .set({
          flLogout: true,
          dtLogout: data,
          tpAcesso: tipo_acesso,
        })
        .where('id_Acesso = :acesso', { acesso })
        .execute();

      // INSERT na tabela security.tbl_UsuarioAcesso (Intervalo)
      const novoIntervalo = queryRunner.manager.create(UsuarioAcesso, {
        tpAcesso: tipo_acesso,
        idUsuario: usuario,
        idProjeto: projeto,
        tpLogin: 2, // tp_Login = 2 para intervalo
        dtLogin: data,
      });

      const intervaloSalvo = await queryRunner.manager.save(novoIntervalo);

      await queryRunner.commitTransaction();

      // Retorna o ID do registro inserido (equivalente ao SCOPE_IDENTITY() do C#)
      registro = intervaloSalvo.idAcesso || 0;

      return {
        sucesso: true,
        registro: registro,
        horario: data,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao registrar intervalo de controle de horário:', error);
      return {
        sucesso: false,
        registro: 0,
        horario: data,
      };
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Método equivalente ao RegistrarSaidaIntervaloControleHorario do C#
   * @param usuario ID do usuário
   * @param cliente ID do cliente (não usado na query, apenas para log de erro)
   * @param projeto ID do projeto
   * @param acesso ID do acesso (id_Acesso)
   * @param tipo Tipo de acesso (tp_Acesso) - se <= 0, será null
   * @returns SaidaIntervaloControleHorarioDto com sucesso e registro (ID inserido)
   */
  async registrarSaidaIntervaloControleHorario(
    usuario: number,
    cliente: number,
    projeto: number,
    acesso: number,
    tipo: number,
  ): Promise<SaidaIntervaloControleHorarioDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const data = new Date();
    let registro = 0;

    try {
      // UPDATE na tabela security.tbl_UsuarioAcesso (Saída do intervalo)
      const updateResult = await queryRunner.manager
        .createQueryBuilder()
        .update(UsuarioAcesso)
        .set({
          flLogout: true,
          dtLogout: data,
        })
        .where('id_Acesso = :acesso', { acesso })
        .execute();

      // Prepara os dados para inserção
      const dadosInsert: any = {
        idUsuario: usuario,
        idProjeto: projeto,
        tpLogin: 1, // tp_Login = 1 para login normal
        dtLogin: data,
      };

      // Se tipo > 0, adiciona tp_Acesso, senão deixa null
      if (tipo > 0) {
        dadosInsert.tpAcesso = tipo;
      } else {
        dadosInsert.tpAcesso = null;
      }

      // INSERT na tabela security.tbl_UsuarioAcesso (Login)
      const novoLogin = queryRunner.manager.create(UsuarioAcesso, dadosInsert);
      const loginSalvo = await queryRunner.manager.save(novoLogin);

      await queryRunner.commitTransaction();

      // Retorna o ID do registro inserido (equivalente ao SCOPE_IDENTITY() do C#)
      registro = loginSalvo.idAcesso || 0;

      return {
        sucesso: true,
        registro: registro,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao registrar saída de intervalo de controle de horário:', error);
      return {
        sucesso: false,
        registro: 0,
      };
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Método equivalente ao RegistrarPausaControleHorario do C#
   * @param usuario ID do usuário
   * @param cliente ID do cliente (não usado na query, apenas para log de erro)
   * @param projeto ID do projeto
   * @param acesso ID do acesso (id_Acesso)
   * @param tipo_acesso Tipo de acesso (tp_Acesso)
   * @param pausa ID da pausa (id_Pausa)
   * @returns PausaControleHorarioDto com sucesso, registro (ID inserido) e horario
   */
  async registrarPausaControleHorario(
    usuario: number,
    cliente: number,
    projeto: number,
    acesso: number,
    tipo_acesso: number,
    pausa: number,
  ): Promise<PausaControleHorarioDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const data = new Date();
    let registro = 0;

    try {
      // UPDATE na tabela security.tbl_UsuarioAcesso (Logout)
      const updateResult = await queryRunner.manager
        .createQueryBuilder()
        .update(UsuarioAcesso)
        .set({
          flLogout: true,
          dtLogout: data,
          tpAcesso: tipo_acesso,
        })
        .where('id_Acesso = :acesso', { acesso })
        .execute();

      // INSERT na tabela security.tbl_UsuarioAcesso (Pausa)
      const novaPausa = queryRunner.manager.create(UsuarioAcesso, {
        tpAcesso: tipo_acesso,
        idUsuario: usuario,
        idProjeto: projeto,
        tpLogin: 3, // tp_Login = 3 para pausa
        idPausa: pausa,
        dtLogin: data,
      });

      const pausaSalva = await queryRunner.manager.save(novaPausa);

      await queryRunner.commitTransaction();

      // Retorna o ID do registro inserido (equivalente ao SCOPE_IDENTITY() do C#)
      registro = pausaSalva.idAcesso || 0;

      return {
        sucesso: true,
        registro: registro,
        horario: data,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao registrar pausa de controle de horário:', error);
      return {
        sucesso: false,
        registro: 0,
        horario: data,
      };
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Método equivalente ao RegistrarSaidaPausaControleHorario do C#
   * @param usuario ID do usuário
   * @param cliente ID do cliente (não usado na query, apenas para log de erro)
   * @param projeto ID do projeto
   * @param acesso ID do acesso (id_Acesso)
   * @param tipo Tipo de acesso (tp_Acesso) - se <= 0, será null
   * @returns SaidaIntervaloControleHorarioDto com sucesso e registro (ID inserido)
   */
  async registrarSaidaPausaControleHorario(
    usuario: number,
    cliente: number,
    projeto: number,
    acesso: number,
    tipo: number,
  ): Promise<SaidaIntervaloControleHorarioDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const data = new Date();
    let registro = 0;

    try {
      // UPDATE na tabela security.tbl_UsuarioAcesso (Saída da pausa)
      const updateResult = await queryRunner.manager
        .createQueryBuilder()
        .update(UsuarioAcesso)
        .set({
          flLogout: true,
          dtLogout: data,
        })
        .where('id_Acesso = :acesso', { acesso })
        .execute();

      // Prepara os dados para inserção
      const dadosInsert: any = {
        idUsuario: usuario,
        idProjeto: projeto,
        tpLogin: 1, // tp_Login = 1 para login normal
        dtLogin: data,
      };

      // Se tipo > 0, adiciona tp_Acesso, senão deixa null
      if (tipo > 0) {
        dadosInsert.tpAcesso = tipo;
      } else {
        dadosInsert.tpAcesso = null;
      }

      // INSERT na tabela security.tbl_UsuarioAcesso (Login)
      const novoLogin = queryRunner.manager.create(UsuarioAcesso, dadosInsert);
      const loginSalvo = await queryRunner.manager.save(novoLogin);

      await queryRunner.commitTransaction();

      // Retorna o ID do registro inserido (equivalente ao SCOPE_IDENTITY() do C#)
      registro = loginSalvo.idAcesso || 0;

      return {
        sucesso: true,
        registro: registro,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao registrar saída de pausa de controle de horário:', error);
      return {
        sucesso: false,
        registro: 0,
      };
    } finally {
      await queryRunner.release();
    }
  }
}

