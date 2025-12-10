import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Login } from '../../domain/entities/login.entity';
import { Usuario } from '../../domain/entities/usuario.entity';
import { Cliente } from '../../domain/entities/cliente.entity';
import { UsuarioAutenticacao } from '../../domain/entities/usuario-autenticacao.entity';
import { Email } from '../../domain/entities/email.entity';
import { HistoricoSenha } from '../../domain/entities/historico-senha.entity';
import { AcessoUsuarioCelular } from '../../domain/entities/acesso-usuario-celular.entity';
import { AcessoUsuario } from '../../domain/entities/acesso-usuario.entity';
import { UsuarioAcesso } from '../../domain/entities/usuario-acesso.entity';
import { UsuarioPausa } from '../../domain/entities/usuario-pausa.entity';
import { UsuarioMultiAcesso } from '../../domain/entities/usuario-multi-acesso.entity';
import { PermissaoUsuarioXSubGrupo } from '../../domain/entities/permissao-usuario-x-subgrupo.entity';
import { GrupoAcessoUsuario } from '../../domain/entities/grupo-acesso-usuario.entity';

function mockRepository() {
  return {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getCount: jest.fn(),
  };
}

// Helpers para encadeamento de queryBuilder
function createQueryBuilderMock() {
  const chain: any = {
    innerJoin: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    update: jest.fn(function(entity) { return this; }),
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    getRawOne: jest.fn(),
    execute: jest.fn(),
    getCount: jest.fn(),
    setParameters: jest.fn().mockReturnThis(),
  };
  return chain;
}

describe('AccountService', () => {
  let service: AccountService;
  let loginRepository: any;
  let usuarioRepository: any;
  let usuarioAutenticacaoRepository: any;
  let emailRepository: any;
  let historicoSenhaRepository: any;
  let acessoUsuarioCelularRepository: any;
  let acessoUsuarioRepository: any;
  let usuarioAcessoRepository: any;
  let usuarioPausaRepository: any;
  let usuarioMultiAcessoRepository: any;
  let permissaoUsuarioXSubGrupoRepository: any;
  let grupoAcessoUsuarioRepository: any;
  let clienteRepository: any;
  let dataSource: any;

  beforeEach(async () => {
    loginRepository = mockRepository();
    usuarioRepository = mockRepository();
    usuarioAutenticacaoRepository = mockRepository();
    emailRepository = mockRepository();
    historicoSenhaRepository = mockRepository();
    acessoUsuarioCelularRepository = mockRepository();
    acessoUsuarioRepository = mockRepository();
    usuarioAcessoRepository = mockRepository();
    usuarioPausaRepository = mockRepository();
    usuarioMultiAcessoRepository = mockRepository();
    permissaoUsuarioXSubGrupoRepository = mockRepository();
    grupoAcessoUsuarioRepository = mockRepository();
    clienteRepository = mockRepository();
    dataSource = {
      createQueryRunner: jest.fn(() => ({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => createQueryBuilderMock()),
          create: jest.fn(),
          save: jest.fn(),
        },
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: getRepositoryToken(Login), useValue: loginRepository },
        { provide: getRepositoryToken(Usuario), useValue: usuarioRepository },
        { provide: getRepositoryToken(Cliente), useValue: clienteRepository },
        { provide: getRepositoryToken(UsuarioAutenticacao), useValue: usuarioAutenticacaoRepository },
        { provide: getRepositoryToken(Email), useValue: emailRepository },
        { provide: getRepositoryToken(HistoricoSenha), useValue: historicoSenhaRepository },
        { provide: getRepositoryToken(AcessoUsuarioCelular), useValue: acessoUsuarioCelularRepository },
        { provide: getRepositoryToken(AcessoUsuario), useValue: acessoUsuarioRepository },
        { provide: getRepositoryToken(UsuarioAcesso), useValue: usuarioAcessoRepository },
        { provide: getRepositoryToken(UsuarioPausa), useValue: usuarioPausaRepository },
        { provide: getRepositoryToken(UsuarioMultiAcesso), useValue: usuarioMultiAcessoRepository },
        { provide: getRepositoryToken(PermissaoUsuarioXSubGrupo), useValue: permissaoUsuarioXSubGrupoRepository },
        { provide: getRepositoryToken(GrupoAcessoUsuario), useValue: grupoAcessoUsuarioRepository },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ------ AUTENTICAÇÃO E CONSULTA BÁSICA ------
  describe('carregarDadosUsuarioValidacao', () => {
    it('retorna array mapeado com dados do usuário', async () => {
      const queryBuilder = createQueryBuilderMock();
      const resultadoMock = [{ id_Empresa: 1, nm_Empresa: 'Empresa', id_Usuario: 2, ds_Usuario: 'usu', ds_Email: 'a@a.com', nm_Usuario: 'Nome' }];
      queryBuilder.getRawMany.mockResolvedValue(resultadoMock);
      loginRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      const res = await service.carregarDadosUsuarioValidacao(1, 'usu');
      expect(res).toHaveLength(1);
      expect(res[0]).toMatchObject({ id_Empresa: 1 });
    });
  });

  describe('carregarDadosUsuarioValidacaoV2', () => {
    it('retorna array usando relations do TypeORM', async () => {
      loginRepository.find.mockResolvedValue([
        { usuario: { cliente: { empresa: { idEmpresa: 1, nmFantasia: 'E' }, idCliente: 2 }, idUsuario: 3, nmUsuario: 'Nome' }, flPrimeiroAcesso: 1, dtUltimaSenha: '', dsUsuario: 'u', dsEmail: 'e@e.com' },
      ]);
      const res = await service.carregarDadosUsuarioValidacaoV2(1, 'user');
      expect(res).toHaveLength(1);
      expect(res[0].id_Empresa).toBe(1);
    });
  });

  describe('validaLogin', () => {
    it('retorna DTO válido se login existir', async () => {
      const queryBuilder = createQueryBuilderMock();
      queryBuilder.getRawOne.mockResolvedValue({ id_Usuario: 99, ds_Password: 'PW', id_Cliente: 9, ds_Email: 'tx@x.com' });
      loginRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      const res = await service.validaLogin(1, 'usuarioX');
      expect(res).toHaveProperty('id_Usuario', 99);
      expect(res.ds_Password).toBe('PW');
    });
    it('retorna null se login não existir', async () => {
      const queryBuilder = createQueryBuilderMock();
      queryBuilder.getRawOne.mockResolvedValue(null);
      loginRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      const res = await service.validaLogin(1, 'usuario_ausente');
      expect(res).toBeNull();
    });
  });

  describe('carregarDadosUsuario', () => {
    it('retorna UsuarioDto completo', async () => {
      const queryBuilder = createQueryBuilderMock();
      queryBuilder.getRawOne.mockResolvedValue({ id_Empresa: 1, id_Cliente: 2, id_Usuario: 10, nm_Usuario: 'User', fl_Adm: 1, fl_Filial: 1, fl_MultiAcesso: 1 });
      usuarioRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      const res = await service.carregarDadosUsuario(10);
      expect(res).toHaveProperty('id_Usuario', 10);
      expect(res.fl_Adm).toBe(true);
    });
    it('retorna null se não existir', async () => {
      const queryBuilder = createQueryBuilderMock();
      queryBuilder.getRawOne.mockResolvedValue(null);
      usuarioRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      const res = await service.carregarDadosUsuario(99);
      expect(res).toBeNull();
    });
  });

  // Os describes dos métodos serão inseridos posteriormente

  // --------- FLUXOS DE UPDATE, INSERT, DELETE E ESPECÍFICOS ---------
  describe('atualizaErroSenha', () => {
    it('atualiza e zera contador erro senha', async () => {
      const qb = createQueryBuilderMock();
      qb.execute.mockResolvedValue({ affected: 1 });
      loginRepository.createQueryBuilder.mockReturnValue(qb);
      const res = await service.atualizaErroSenha(1, false);
      expect(qb.set).toHaveBeenCalled();
      expect(res).toBe(true);
    });
    it('retorna false se erro/dispara exceção', async () => {
      loginRepository.createQueryBuilder.mockImplementation(() => { throw new Error('fail'); });
      const res = await service.atualizaErroSenha(1, false);
      expect(res).toBe(false);
    });
  });

  describe('armazenaCodigoAutenticacaoUsuario', () => {
    it('insere novo código/transação ok', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => createQueryBuilderMock()),
          create: jest.fn().mockReturnValue({}),
          save: jest.fn().mockResolvedValue({}),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.armazenaCodigoAutenticacaoUsuario(1, 2, 'code', false);
      expect(res).toBe(true);
      expect(qRunner.connect).toHaveBeenCalled();
      expect(qRunner.startTransaction).toHaveBeenCalled();
      expect(qRunner.commitTransaction).toHaveBeenCalled();
      expect(qRunner.release).toHaveBeenCalled();
    });
    it('update código existente/transação ok', async () => {
      const qb = createQueryBuilderMock();
      qb.execute.mockResolvedValue({ affected: 1 });
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => qb),
          create: jest.fn(),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.armazenaCodigoAutenticacaoUsuario(1, 2, 'code', true);
      expect(res).toBe(true);
      expect(qRunner.connect).toHaveBeenCalled();
      expect(qRunner.startTransaction).toHaveBeenCalled();
      expect(qRunner.commitTransaction).toHaveBeenCalled();
      expect(qRunner.release).toHaveBeenCalled();
    });
    it('retorna false se falha/erro/rollback', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => createQueryBuilderMock()),
          create: jest.fn().mockImplementation(() => { throw new Error(); }),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.armazenaCodigoAutenticacaoUsuario(1, 2, 'x', false);
      expect(res).toBe(false);
      expect(qRunner.rollbackTransaction).toHaveBeenCalled();
      expect(qRunner.release).toHaveBeenCalled();
    });
  });

  describe('carregaParametrosEmail', () => {
    it('retorna objeto EmailDto se sucesso', async () => {
      const qb = createQueryBuilderMock();
      qb.getRawOne.mockResolvedValue({ ds_Email: 'a@a.com', fl_SSL: 1 });
      emailRepository.createQueryBuilder.mockReturnValue(qb);
      const res = await service.carregaParametrosEmail();
      expect(res.ds_Email).toEqual('a@a.com');
      expect(res.fl_SSL).toEqual(true);
    });
    it('retorna null se não houver registro', async () => {
      const qb = createQueryBuilderMock();
      qb.getRawOne.mockResolvedValue(null);
      emailRepository.createQueryBuilder.mockReturnValue(qb);
      const res = await service.carregaParametrosEmail();
      expect(res).toBeNull();
    });
  });

  describe('verificaNomeUsuarioExiste', () => {
    it('retorna true se já existir', async () => {
      const qb = createQueryBuilderMock();
      qb.getCount.mockResolvedValue(2);
      loginRepository.createQueryBuilder.mockReturnValue(qb);
      const exists = await service.verificaNomeUsuarioExiste(1, 1, 'nome');
      expect(exists).toBe(true);
    });
    it('retorna false se não existir', async () => {
      const qb = createQueryBuilderMock();
      qb.getCount.mockResolvedValue(0);
      loginRepository.createQueryBuilder.mockReturnValue(qb);
      const exists = await service.verificaNomeUsuarioExiste(1, 1, 'nomeFalso');
      expect(exists).toBe(false);
    });
  });

  describe('verificaSenhaUsadaAnteriormente', () => {
    it('retorna true se senha já foi usada', async () => {
      const qb = createQueryBuilderMock();
      qb.getCount.mockResolvedValue(1);
      historicoSenhaRepository.createQueryBuilder.mockReturnValue(qb);
      const used = await service.verificaSenhaUsadaAnteriormente(3, 'senha');
      expect(used).toBe(true);
    });
    it('retorna false se senha nunca usada', async () => {
      const qb = createQueryBuilderMock();
      qb.getCount.mockResolvedValue(0);
      historicoSenhaRepository.createQueryBuilder.mockReturnValue(qb);
      const used = await service.verificaSenhaUsadaAnteriormente(3, 'senhaX');
      expect(used).toBe(false);
    });
  });

  describe('salvarSenhaUsuario', () => {
    it('salva e insere novo histórico (caso feliz)', async () => {
      const qb = createQueryBuilderMock();
      qb.execute.mockResolvedValue({ affected: 1 });
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => qb),
          create: jest.fn().mockReturnValue({}),
          save: jest.fn().mockResolvedValue({}),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.salvarSenhaUsuario(1, 2, 'nome', 'pw', true);
      expect(res).toBe(true);
      expect(qRunner.connect).toHaveBeenCalled();
      expect(qRunner.startTransaction).toHaveBeenCalled();
      expect(qRunner.commitTransaction).toHaveBeenCalled();
      expect(qRunner.release).toHaveBeenCalled();
    });
    it('retorna false se falhar e rollback', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn().mockImplementation(() => { throw new Error(); }),
          create: jest.fn(),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.salvarSenhaUsuario(1, 2, null, 'pw', false);
      expect(res).toBe(false);
      expect(qRunner.rollbackTransaction).toHaveBeenCalled();
      expect(qRunner.release).toHaveBeenCalled();
    });
  });

  describe('verificaCodigoAutenticacaoUsuarioExiste', () => {
    it('retorna true se código existe', async () => {
      const qb = createQueryBuilderMock();
      qb.getCount.mockResolvedValue(1);
      usuarioAutenticacaoRepository.createQueryBuilder.mockReturnValue(qb);
      const exists = await service.verificaCodigoAutenticacaoUsuarioExiste(1, 2);
      expect(exists).toBe(true);
    });
    it('retorna false se código não existe', async () => {
      const qb = createQueryBuilderMock();
      qb.getCount.mockResolvedValue(0);
      usuarioAutenticacaoRepository.createQueryBuilder.mockReturnValue(qb);
      const exists = await service.verificaCodigoAutenticacaoUsuarioExiste(1, 2);
      expect(exists).toBe(false);
    });
    it('retorna false em caso de erro', async () => {
      usuarioAutenticacaoRepository.createQueryBuilder.mockImplementation(() => { throw new Error(); });
      const exists = await service.verificaCodigoAutenticacaoUsuarioExiste(1, 2);
      expect(exists).toBe(false);
    });
  });

  describe('carregarDadosCodigoAutenticacao', () => {
    it('retorna AutenticacaoDto quando encontrado', async () => {
      const qb = createQueryBuilderMock();
      qb.getRawOne.mockResolvedValue({ dt_Modificacao: new Date(), id_Empresa: 1, id_Usuario: 2, ds_Codigo: 'ABC123' });
      usuarioAutenticacaoRepository.createQueryBuilder.mockReturnValue(qb);
      const res = await service.carregarDadosCodigoAutenticacao(1, 2);
      expect(res).toHaveProperty('ds_Codigo', 'ABC123');
      expect(res.id_Empresa).toBe(1);
    });
    it('retorna null quando não encontrado', async () => {
      const qb = createQueryBuilderMock();
      qb.getRawOne.mockResolvedValue(null);
      usuarioAutenticacaoRepository.createQueryBuilder.mockReturnValue(qb);
      const res = await service.carregarDadosCodigoAutenticacao(1, 2);
      expect(res).toBeNull();
    });
    it('retorna null em caso de erro', async () => {
      usuarioAutenticacaoRepository.createQueryBuilder.mockImplementation(() => { throw new Error(); });
      const res = await service.carregarDadosCodigoAutenticacao(1, 2);
      expect(res).toBeNull();
    });
  });

  describe('registroLogAcessoCelular', () => {
    it('registra log com sucesso', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => createQueryBuilderMock()),
          create: jest.fn().mockReturnValue({}),
          save: jest.fn().mockResolvedValue({}),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const data = new Date();
      const res = await service.registroLogAcessoCelular(1, 2, '192.168.1.1', data, 'info');
      expect(res).toBe(true);
      expect(qRunner.manager.create).toHaveBeenCalled();
      expect(qRunner.commitTransaction).toHaveBeenCalled();
    });
    it('retorna false em caso de erro', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => createQueryBuilderMock()),
          create: jest.fn().mockImplementation(() => { throw new Error(); }),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.registroLogAcessoCelular(1, 2, '192.168.1.1', new Date(), 'info');
      expect(res).toBe(false);
      expect(qRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('registroLogAcessoUsuario', () => {
    it('registra log com sucesso', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => createQueryBuilderMock()),
          create: jest.fn().mockReturnValue({}),
          save: jest.fn().mockResolvedValue({}),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const data = new Date();
      const res = await service.registroLogAcessoUsuario(1, 2, '192.168.1.1', data);
      expect(res).toBe(true);
      expect(qRunner.manager.create).toHaveBeenCalled();
      expect(qRunner.commitTransaction).toHaveBeenCalled();
    });
    it('retorna false em caso de erro', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => createQueryBuilderMock()),
          create: jest.fn().mockImplementation(() => { throw new Error(); }),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.registroLogAcessoUsuario(1, 2, '192.168.1.1', new Date());
      expect(res).toBe(false);
      expect(qRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('verificaQuantidadeLogoutIncorreto', () => {
    it('retorna quantidade quando há logout incorreto', async () => {
      const qb = createQueryBuilderMock();
      qb.getCount.mockResolvedValue(3);
      usuarioAcessoRepository.createQueryBuilder.mockReturnValue(qb);
      const count = await service.verificaQuantidadeLogoutIncorreto(1, 2);
      expect(count).toBe(3);
    });
    it('retorna 0 quando não há logout incorreto', async () => {
      const qb = createQueryBuilderMock();
      qb.getCount.mockResolvedValue(0);
      usuarioAcessoRepository.createQueryBuilder.mockReturnValue(qb);
      const count = await service.verificaQuantidadeLogoutIncorreto(1, 2);
      expect(count).toBe(0);
    });
    it('retorna 0 em caso de erro', async () => {
      usuarioAcessoRepository.createQueryBuilder.mockImplementation(() => { throw new Error(); });
      const count = await service.verificaQuantidadeLogoutIncorreto(1, 2);
      expect(count).toBe(0);
    });
  });

  describe('bloqueioHorarioInvalidoUsuario', () => {
    it('bloqueia usuário com sucesso', async () => {
      const qb = createQueryBuilderMock();
      qb.execute.mockResolvedValue({ affected: 1 });
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => qb),
          create: jest.fn(),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.bloqueioHorarioInvalidoUsuario(1, 2);
      expect(res).toBe(true);
      expect(qRunner.commitTransaction).toHaveBeenCalled();
    });
    it('retorna false em caso de erro', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn().mockImplementation(() => { throw new Error(); }),
          create: jest.fn(),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.bloqueioHorarioInvalidoUsuario(1, 2);
      expect(res).toBe(false);
      expect(qRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('carregarPausas', () => {
    it('retorna array de pausas', async () => {
      const qb = createQueryBuilderMock();
      qb.getRawMany.mockResolvedValue([
        { id_Empresa: 1, id_Pausa: 1, ds_Pausa: 'Pausa 1' },
        { id_Empresa: 1, id_Pausa: 2, ds_Pausa: 'Pausa 2' },
      ]);
      usuarioPausaRepository.createQueryBuilder.mockReturnValue(qb);
      const res = await service.carregarPausas(1, 2, 1);
      expect(res).toHaveLength(2);
      expect(res[0]).toHaveProperty('ds_Pausa', 'Pausa 1');
    });
    it('retorna array vazio quando não há pausas', async () => {
      const qb = createQueryBuilderMock();
      qb.getRawMany.mockResolvedValue([]);
      usuarioPausaRepository.createQueryBuilder.mockReturnValue(qb);
      const res = await service.carregarPausas(1, 2, 1);
      expect(res).toHaveLength(0);
    });
    it('retorna array vazio em caso de erro', async () => {
      usuarioPausaRepository.createQueryBuilder.mockImplementation(() => { throw new Error(); });
      const res = await service.carregarPausas(1, 2, 1);
      expect(res).toHaveLength(0);
    });
  });

  describe('registraLogControleHorario', () => {
    it('registra log e retorna ID do acesso', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => createQueryBuilderMock()),
          create: jest.fn().mockReturnValue({}),
          save: jest.fn().mockResolvedValue({ idAcesso: 123 }),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.registraLogControleHorario(1, 2, 1, 3, new Date());
      expect(res).toBe(123);
      expect(qRunner.commitTransaction).toHaveBeenCalled();
    });
    it('retorna 0 em caso de erro', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => createQueryBuilderMock()),
          create: jest.fn().mockImplementation(() => { throw new Error(); }),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.registraLogControleHorario(1, 2, 1, 3, new Date());
      expect(res).toBe(0);
      expect(qRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('carregarListaClientesMenu', () => {
    it('retorna array de clientes do menu', async () => {
      const qb = createQueryBuilderMock();
      qb.getRawMany.mockResolvedValue([
        { id_Cliente: 1, nm_Fantasia: 'Cliente 1', id_Usuario: 1 },
        { id_Cliente: 2, nm_Fantasia: 'Cliente 2', id_Usuario: 1 },
      ]);
      usuarioMultiAcessoRepository.createQueryBuilder.mockReturnValue(qb);
      const res = await service.carregarListaClientesMenu(1, 0);
      expect(res).toHaveLength(2);
      expect(res[0]).toHaveProperty('nm_Fantasia', 'Cliente 1');
    });
    it('retorna array vazio quando não há clientes', async () => {
      const qb = createQueryBuilderMock();
      qb.getRawMany.mockResolvedValue([]);
      usuarioMultiAcessoRepository.createQueryBuilder.mockReturnValue(qb);
      const res = await service.carregarListaClientesMenu(1, 0);
      expect(res).toHaveLength(0);
    });
    it('retorna array vazio em caso de erro', async () => {
      usuarioMultiAcessoRepository.createQueryBuilder.mockImplementation(() => { throw new Error(); });
      const res = await service.carregarListaClientesMenu(1, 0);
      expect(res).toHaveLength(0);
    });
  });

  describe('carregarModulos', () => {
    it('retorna array de módulos', async () => {
      const subquery = createQueryBuilderMock();
      subquery.getQuery = jest.fn().mockReturnValue('SELECT idModulo FROM ...');
      subquery.getParameters = jest.fn().mockReturnValue({ cliente: 1 });
      dataSource.createQueryBuilder = jest.fn().mockReturnValue(subquery);
      const qb = createQueryBuilderMock();
      qb.getRawMany.mockResolvedValue([
        { id_Usuario: 1, id_Modulo: 1, ds_Modulo: 'Módulo 1', ic_Modulo: 'icon1' },
      ]);
      permissaoUsuarioXSubGrupoRepository.createQueryBuilder.mockReturnValue(qb);
      const res = await service.carregarModulos(1, 1);
      expect(res).toHaveLength(1);
      expect(res[0]).toHaveProperty('ds_Modulo', 'Módulo 1');
    });
    it('retorna array vazio em caso de erro', async () => {
      permissaoUsuarioXSubGrupoRepository.createQueryBuilder.mockImplementation(() => { throw new Error(); });
      const res = await service.carregarModulos(1, 1);
      expect(res).toHaveLength(0);
    });
  });

  describe('carregarGrupos', () => {
    it('retorna array de grupos', async () => {
      const qb = createQueryBuilderMock();
      qb.getRawMany.mockResolvedValue([
        { id_Usuario: 1, id_Modulo: 1, id_Grupo: 1, ds_Grupo: 'Grupo 1', ic_Grupo: 'icon1' },
      ]);
      permissaoUsuarioXSubGrupoRepository.createQueryBuilder.mockReturnValue(qb);
      const res = await service.carregarGrupos(1, 1);
      expect(res).toHaveLength(1);
      expect(res[0]).toHaveProperty('ds_Grupo', 'Grupo 1');
    });
    it('retorna array vazio em caso de erro', async () => {
      permissaoUsuarioXSubGrupoRepository.createQueryBuilder.mockImplementation(() => { throw new Error(); });
      const res = await service.carregarGrupos(1, 1);
      expect(res).toHaveLength(0);
    });
  });

  describe('carregarSubGrupos', () => {
    it('retorna array de subgrupos', async () => {
      const qb = createQueryBuilderMock();
      qb.getRawMany.mockResolvedValue([
        { id_Usuario: 1, id_Grupo: 1, id_SubGrupo: 1, ds_SubGrupo: 'SubGrupo 1', ds_Pasta: 'pasta1', ds_View: 'view1', id_GrupoAcessoUsuario: 1 },
      ]);
      permissaoUsuarioXSubGrupoRepository.createQueryBuilder.mockReturnValue(qb);
      const res = await service.carregarSubGrupos(1, 1);
      expect(res).toHaveLength(1);
      expect(res[0]).toHaveProperty('ds_SubGrupo', 'SubGrupo 1');
    });
    it('retorna array vazio em caso de erro', async () => {
      permissaoUsuarioXSubGrupoRepository.createQueryBuilder.mockImplementation(() => { throw new Error(); });
      const res = await service.carregarSubGrupos(1, 1);
      expect(res).toHaveLength(0);
    });
  });

  describe('carregaPermissoes', () => {
    it('retorna PermissaoDto quando encontrado', async () => {
      grupoAcessoUsuarioRepository.findOne.mockResolvedValue({
        flIncluir: true,
        flAlterar: true,
        flExcluir: false,
        flPesquisar: true,
      });
      const res = await service.carregaPermissoes(1, 2, 1);
      expect(res).toHaveProperty('fl_Incluir', true);
      expect(res.fl_Alterar).toBe(true);
    });
    it('retorna null quando não encontrado', async () => {
      grupoAcessoUsuarioRepository.findOne.mockResolvedValue(null);
      const res = await service.carregaPermissoes(1, 2, 999);
      expect(res).toBeNull();
    });
    it('retorna null em caso de erro', async () => {
      grupoAcessoUsuarioRepository.findOne.mockImplementation(() => { throw new Error(); });
      const res = await service.carregaPermissoes(1, 2, 1);
      expect(res).toBeNull();
    });
  });

  describe('carregarDadosCliente', () => {
    it('retorna ClienteDto quando encontrado', async () => {
      clienteRepository.findOne.mockResolvedValue({
        idCliente: 1,
        nmFantasia: 'Cliente Teste',
        idMatriz: 0,
        flFilial: false,
        flMascararCamposLgpd: true,
        flHigienizacaoLead: false,
        flSobreLead: true,
      });
      const res = await service.carregarDadosCliente(1, 1);
      expect(res).toHaveProperty('nm_Fantasia', 'Cliente Teste');
      expect(res.fl_Filial).toBe(false);
    });
    it('retorna null quando não encontrado', async () => {
      clienteRepository.findOne.mockResolvedValue(null);
      const res = await service.carregarDadosCliente(1, 999);
      expect(res).toBeNull();
    });
    it('retorna null em caso de erro', async () => {
      clienteRepository.findOne.mockImplementation(() => { throw new Error(); });
      const res = await service.carregarDadosCliente(1, 1);
      expect(res).toBeNull();
    });
  });

  describe('updateClienteLogAcessoUsuario', () => {
    it('atualiza cliente com sucesso', async () => {
      const qb = createQueryBuilderMock();
      qb.execute.mockResolvedValue({ affected: 1 });
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => qb),
          create: jest.fn(),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.updateClienteLogAcessoUsuario(1, 2);
      expect(res).toBe(true);
      expect(qRunner.commitTransaction).toHaveBeenCalled();
    });
    it('retorna false em caso de erro', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn().mockImplementation(() => { throw new Error(); }),
          create: jest.fn(),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.updateClienteLogAcessoUsuario(1, 2);
      expect(res).toBe(false);
      expect(qRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('excluirLogAcessoUsuario', () => {
    it('exclui log com sucesso', async () => {
      const qb = createQueryBuilderMock();
      qb.execute.mockResolvedValue({ affected: 1 });
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => qb),
          create: jest.fn(),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.excluirLogAcessoUsuario(1, 2);
      expect(res).toBe(true);
      expect(qRunner.commitTransaction).toHaveBeenCalled();
    });
    it('retorna false em caso de erro', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn().mockImplementation(() => { throw new Error(); }),
          create: jest.fn(),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.excluirLogAcessoUsuario(1, 2);
      expect(res).toBe(false);
      expect(qRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('registarLogoutControleHorario', () => {
    it('registra logout com sucesso', async () => {
      const qb = createQueryBuilderMock();
      qb.execute.mockResolvedValue({ affected: 1 });
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => qb),
          create: jest.fn(),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.registarLogoutControleHorario(1, 2, 10, 1);
      expect(res).toBe(true);
      expect(qRunner.commitTransaction).toHaveBeenCalled();
    });
    it('retorna false em caso de erro', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn().mockImplementation(() => { throw new Error(); }),
          create: jest.fn(),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.registarLogoutControleHorario(1, 2, 10, 1);
      expect(res).toBe(false);
      expect(qRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('registrarIntervaloControleHorario', () => {
    it('registra intervalo com sucesso', async () => {
      const qb = createQueryBuilderMock();
      qb.execute.mockResolvedValue({ affected: 1 });
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => qb),
          create: jest.fn().mockReturnValue({}),
          save: jest.fn().mockResolvedValue({ idAcesso: 456 }),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.registrarIntervaloControleHorario(1, 2, 3, 10, 1);
      expect(res.sucesso).toBe(true);
      expect(res.registro).toBe(456);
      expect(res.horario).toBeInstanceOf(Date);
    });
    it('retorna sucesso false em caso de erro', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn().mockImplementation(() => { throw new Error(); }),
          create: jest.fn(),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.registrarIntervaloControleHorario(1, 2, 3, 10, 1);
      expect(res.sucesso).toBe(false);
      expect(res.registro).toBe(0);
    });
  });

  describe('registrarSaidaIntervaloControleHorario', () => {
    it('registra saída de intervalo com sucesso', async () => {
      const qb = createQueryBuilderMock();
      qb.execute.mockResolvedValue({ affected: 1 });
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => qb),
          create: jest.fn().mockReturnValue({}),
          save: jest.fn().mockResolvedValue({ idAcesso: 789 }),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.registrarSaidaIntervaloControleHorario(1, 2, 3, 10, 1);
      expect(res.sucesso).toBe(true);
      expect(res.registro).toBe(789);
    });
    it('retorna sucesso false em caso de erro', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn().mockImplementation(() => { throw new Error(); }),
          create: jest.fn(),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.registrarSaidaIntervaloControleHorario(1, 2, 3, 10, 1);
      expect(res.sucesso).toBe(false);
      expect(res.registro).toBe(0);
    });
  });

  describe('registrarPausaControleHorario', () => {
    it('registra pausa com sucesso', async () => {
      const qb = createQueryBuilderMock();
      qb.execute.mockResolvedValue({ affected: 1 });
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => qb),
          create: jest.fn().mockReturnValue({}),
          save: jest.fn().mockResolvedValue({ idAcesso: 111 }),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.registrarPausaControleHorario(1, 2, 3, 10, 1, 5);
      expect(res.sucesso).toBe(true);
      expect(res.registro).toBe(111);
      expect(res.horario).toBeInstanceOf(Date);
    });
    it('retorna sucesso false em caso de erro', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn().mockImplementation(() => { throw new Error(); }),
          create: jest.fn(),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.registrarPausaControleHorario(1, 2, 3, 10, 1, 5);
      expect(res.sucesso).toBe(false);
      expect(res.registro).toBe(0);
    });
  });

  describe('registrarSaidaPausaControleHorario', () => {
    it('registra saída de pausa com sucesso', async () => {
      const qb = createQueryBuilderMock();
      qb.execute.mockResolvedValue({ affected: 1 });
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn(() => qb),
          create: jest.fn().mockReturnValue({}),
          save: jest.fn().mockResolvedValue({ idAcesso: 222 }),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.registrarSaidaPausaControleHorario(1, 2, 3, 10, 1);
      expect(res.sucesso).toBe(true);
      expect(res.registro).toBe(222);
    });
    it('retorna sucesso false em caso de erro', async () => {
      const qRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          createQueryBuilder: jest.fn().mockImplementation(() => { throw new Error(); }),
          create: jest.fn(),
          save: jest.fn(),
        },
      };
      dataSource.createQueryRunner.mockReturnValue(qRunner);
      const res = await service.registrarSaidaPausaControleHorario(1, 2, 3, 10, 1);
      expect(res.sucesso).toBe(false);
      expect(res.registro).toBe(0);
    });
  });
});
