import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { AccountService } from '../../application/services/account.service';
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
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiQuery } from '@nestjs/swagger';

// Interfaces de validação de entrada (tipos compostos para body)
interface ValidaLoginInput { tipo: number; usuario: string; }
interface CarregarDadosUsuarioInput { usuario: number; }
interface AtualizaErroSenhaInput { usuario: number; erro: boolean; }
interface CodigoAutenticacaoInput { empresa: number; usuario: number; codigo: string; atualizar: boolean; }
interface VerificaCodigoAutenticacaoInput { empresa: number; usuario: number; }
interface VerificaNomeUsuarioExisteInput { empresa: number; usuario: number; nome: string; }
interface VerificaSenhaAnteriorInput { usuario: number; senha: string; }
interface SalvarSenhaUsuarioInput { empresa: number; usuario: number; nome_usuario?: string|null; senha: string; primeiro_acesso: boolean; }
interface LogAcessoCelularInput { usuario: number; cliente: number; ip: string; data: Date; info: string; }
interface LogAcessoUsuarioInput { usuario: number; cliente: number; ip: string; data: Date; }
interface BloqueioHorarioInvalidoUsuarioInput { usuario: number; cliente: number; }
interface CarregarPausasInput { usuario: number; cliente: number; empresa: number; }
interface RegistraLogControleHorarioInput { usuario: number; cliente: number; acesso: number; projeto: number; data: Date; }
interface CarregarListaClientesMenuInput { usuario: number; matriz: number; }
interface CarregarModulosInput { usuario: number; cliente: number; }
interface CarregarGruposInput { usuario: number; modulo: number; }
interface CarregarSubGruposInput { usuario: number; grupo: number; }
interface CarregaPermissoesInput { usuario: number; cliente: number; permissao: number; }
interface CarregarDadosClienteInput { usuario: number; cliente: number; }
interface UpdateClienteLogAcessoUsuarioInput { usuario: number; cliente: number; }
interface ExcluirLogAcessoUsuarioInput { usuario: number; cliente: number; }
interface RegistarLogoutControleHorarioInput { usuario: number; cliente: number; acesso: number; tipo_acesso: number; }
interface RegistrarIntervaloControleHorarioInput { usuario: number; cliente: number; projeto: number; acesso: number; tipo_acesso: number; }
interface RegistrarSaidaIntervaloControleHorarioInput { usuario: number; cliente: number; projeto: number; acesso: number; tipo: number; }
interface RegistrarPausaControleHorarioInput { usuario: number; cliente: number; projeto: number; acesso: number; tipo_acesso: number; pausa: number; }
interface RegistrarSaidaPausaControleHorarioInput { usuario: number; cliente: number; projeto: number; acesso: number; tipo: number; }

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('carregarDadosUsuarioValidacao')
  @ApiOperation({ summary: 'Validação e consulta de usuário por nome ou email.' })
  @ApiBody({
    schema: {
      properties: {
        tipo: { type: 'number', example: 1, description: '1 para validar por nome de usuário, 2 para validar por email' },
        usuario: { type: 'string', example: 'joao', description: 'Nome de usuário ou email' },
      }
    },
    examples: {
      'Por nome de usuário': { value: { tipo: 1, usuario: 'joao' } },
      'Por email': { value: { tipo: 2, usuario: 'joao@email.com' } }
    }
  })
  @ApiOkResponse({ type: [UsuarioValidacaoDto] })
  async carregarDadosUsuarioValidacao(@Body() body: { tipo: number, usuario: string }): Promise<UsuarioValidacaoDto[]> {
    return this.accountService.carregarDadosUsuarioValidacao(body.tipo, body.usuario);
  }

  @Post('carregarDadosUsuarioValidacaoV2')
  @ApiOperation({ summary: 'Validação alternativa usando relations.' })
  @ApiBody({
    schema: {
      properties: {
        tipo: { type: 'number', example: 2, description: '1 para nome, 2 para email' },
        usuario: { type: 'string', example: 'ana@email.com', description: 'Email a ser validado' },
      }
    },
    examples: {
      'Por email': { value: { tipo: 2, usuario: 'ana@email.com' } },
      'Por nome': { value: { tipo: 1, usuario: 'ana' } }
    }
  })
  @ApiOkResponse({ type: [UsuarioValidacaoDto] })
  async carregarDadosUsuarioValidacaoV2(@Body() body: { tipo: number, usuario: string }): Promise<UsuarioValidacaoDto[]> {
    return this.accountService.carregarDadosUsuarioValidacaoV2(body.tipo, body.usuario);
  }

  @Post('validaLogin')
  @ApiOperation({ summary: 'Valida login do usuário.' })
  @ApiBody({
    schema: {
      properties: {
        tipo: { type: 'number', example: 1, description: '1 para login por nome, 2 para login por email' },
        usuario: { type: 'string', example: 'maria@email.com', description: 'nome de usuário ou email' }
      }
    },
    examples: {
      'Login nome': { value: { tipo: 1, usuario: 'maria' } },
      'Login email': { value: { tipo: 2, usuario: 'maria@email.com' } }
    }
  })
  @ApiOkResponse({ type: LoginDto })
  async validaLogin(@Body() body: ValidaLoginInput): Promise<LoginDto | null> {
    return this.accountService.validaLogin(body.tipo, body.usuario);
  }

  @Get('carregarDadosUsuario')
  @ApiOperation({ summary: 'Consulta dados completos do usuário.' })
  @ApiQuery({ name: 'usuario', type: Number, example: 42, description: 'ID do usuário a ser consultado' })
  @ApiOkResponse({ type: UsuarioDto })
  async carregarDadosUsuario(@Query('usuario') usuario: number): Promise<UsuarioDto | null> {
    return this.accountService.carregarDadosUsuario(usuario);
  }

  @Post('atualizaErroSenha')
  @ApiOperation({ summary: 'Atualiza contador de erro de senha.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 101, description: 'ID do usuário' },
        erro: { type: 'boolean', example: true, description: 'true para incrementar erro, false para zerar' },
      },
    },
    examples: {
      'Incrementar erro': { value: { usuario: 101, erro: true } },
      'Zerar erro': { value: { usuario: 101, erro: false } }
    }
  })
  async atualizaErroSenha(@Body() body: AtualizaErroSenhaInput): Promise<boolean> {
    return this.accountService.atualizaErroSenha(body.usuario, body.erro);
  }

  @Post('verificaCodigoAutenticacaoUsuarioExiste')
  @ApiOperation({ summary: 'Verifica existência de código de autenticação.' })
  @ApiBody({
    schema: {
      properties: {
        empresa: { type: 'number', example: 1, description: 'ID da empresa' },
        usuario: { type: 'number', example: 45, description: 'ID do usuário' },
      }
    },
    examples: {
      'Buscar': { value: { empresa: 1, usuario: 45 } }
    }
  })
  async verificaCodigoAutenticacaoUsuarioExiste(@Body() body: VerificaCodigoAutenticacaoInput): Promise<boolean> {
    return this.accountService.verificaCodigoAutenticacaoUsuarioExiste(body.empresa, body.usuario);
  }

  @Get('carregarDadosCodigoAutenticacao')
  @ApiOperation({ summary: 'Consulta código de autenticação.' })
  @ApiQuery({ name: 'empresa', type: Number, example: 1, description: 'ID da empresa' })
  @ApiQuery({ name: 'usuario', type: Number, example: 45, description: 'ID do usuário' })
  @ApiOkResponse({ type: AutenticacaoDto })
  async carregarDadosCodigoAutenticacao(@Query('empresa') empresa: number, @Query('usuario') usuario: number): Promise<AutenticacaoDto | null> {
    return this.accountService.carregarDadosCodigoAutenticacao(empresa, usuario);
  }

  @Post('armazenaCodigoAutenticacaoUsuario')
  @ApiOperation({ summary: 'Cria/atualiza código de autenticação.' })
  @ApiBody({
    schema: {
      properties: {
        empresa: { type: 'number', example: 1, description: 'ID da empresa' },
        usuario: { type: 'number', example: 45, description: 'ID do usuário' },
        codigo: { type: 'string', example: 'XYZ123', description: 'Código de autenticação' },
        atualizar: { type: 'boolean', example: false, description: 'false para criar, true para atualizar' }
      }
    },
    examples: {
      'Novo código': { value: { empresa: 1, usuario: 45, codigo: 'XYZ123', atualizar: false } },
      'Atualizar': { value: { empresa: 1, usuario: 45, codigo: 'ABC789', atualizar: true } }
    }
  })
  async armazenaCodigoAutenticacaoUsuario(@Body() body: CodigoAutenticacaoInput): Promise<boolean> {
    return this.accountService.armazenaCodigoAutenticacaoUsuario(body.empresa, body.usuario, body.codigo, body.atualizar);
  }

  @Get('carregaParametrosEmail')
  @ApiOperation({ summary: 'Consulta parâmetros de e-mail.' })
  @ApiOkResponse({ type: EmailDto })
  async carregaParametrosEmail(): Promise<EmailDto | null> {
    return this.accountService.carregaParametrosEmail();
  }

  @Post('verificaNomeUsuarioExiste')
  @ApiOperation({ summary: 'Verifica se nome de usuário existe.' })
  @ApiBody({
    schema: {
      properties: {
        empresa: { type: 'number', example: 1, description: 'ID da empresa' },
        usuario: { type: 'number', example: 45, description: 'ID do usuário (só para log)' },
        nome: { type: 'string', example: 'usuarioTeste', description: 'Nome de usuário a verificar' }
      }
    },
    examples: {
      'Exemplo': { value: { empresa: 1, usuario: 45, nome: 'usuarioTeste' } }
    }
  })
  async verificaNomeUsuarioExiste(@Body() body: VerificaNomeUsuarioExisteInput): Promise<boolean> {
    return this.accountService.verificaNomeUsuarioExiste(body.empresa, body.usuario, body.nome);
  }

  @Post('verificaSenhaUsadaAnteriormente')
  @ApiOperation({ summary: 'Verifica se senha já foi usada.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 45, description: 'ID do usuário' },
        senha: { type: 'string', example: 'Senha123', description: 'Senha a ser verificada' }
      }
    },
    examples: {
      'Senha usada': { value: { usuario: 45, senha: 'Senha123' } }
    }
  })
  async verificaSenhaUsadaAnteriormente(@Body() body: VerificaSenhaAnteriorInput): Promise<boolean> {
    return this.accountService.verificaSenhaUsadaAnteriormente(body.usuario, body.senha);
  }

  @Post('salvarSenhaUsuario')
  @ApiOperation({ summary: 'Salva nova senha e registra histórico.' })
  @ApiBody({
    schema: {
      properties: {
        empresa: { type: 'number', example: 1, description: 'ID da empresa (para log)' },
        usuario: { type: 'number', example: 45, description: 'ID do usuário' },
        nome_usuario: { type: 'string', example: 'usuarioTeste', description: '(Opcional) novo nome de usuário' },
        senha: { type: 'string', example: 'NovaSenhaSegura!2024', description: 'Nova senha' },
        primeiro_acesso: { type: 'boolean', example: false, description: 'Se true, marca primeiro acesso como concluído' }
      }
    },
    examples: {
      'Alterar senha e nome': { value: { empresa: 1, usuario: 45, nome_usuario: 'usuarioNovo', senha: '123teste', primeiro_acesso: true } },
      'Só trocar senha': { value: { empresa: 1, usuario: 45, senha: 'NovaSenhaSegura!2024', primeiro_acesso: false } }
    }
  })
  async salvarSenhaUsuario(@Body() body: SalvarSenhaUsuarioInput): Promise<boolean> {
    return this.accountService.salvarSenhaUsuario(
      body.empresa, body.usuario, body.nome_usuario ?? null, body.senha, body.primeiro_acesso
    );
  }

  @Post('registroLogAcessoCelular')
  @ApiOperation({ summary: 'Registra log de acesso via celular.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 45, description: 'ID do usuário' },
        cliente: { type: 'number', example: 2, description: 'ID do cliente' },
        ip: { type: 'string', example: '187.60.10.150', description: 'IP do acesso' },
        data: { type: 'string', example: '2025-12-09T13:36:00.000Z', description: 'Data/hora ISO 8601' },
        info: { type: 'string', example: 'Android 14, Redmi', description: 'Informações adicionais do acesso' }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 45, cliente: 2, ip: '187.60.10.150', data: '2025-12-09T13:36:00.000Z', info: 'Android 14, Redmi' } }
    }
  })
  async registroLogAcessoCelular(@Body() body: LogAcessoCelularInput): Promise<boolean> {
    return this.accountService.registroLogAcessoCelular(
      body.usuario, body.cliente, body.ip, new Date(body.data), body.info
    );
  }

  @Post('registroLogAcessoUsuario')
  @ApiOperation({ summary: 'Registra log de acesso do usuário.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 45, description: 'ID do usuário' },
        cliente: { type: 'number', example: 2, description: 'ID do cliente' },
        ip: { type: 'string', example: '10.0.0.5', description: 'IP do acesso' },
        data: { type: 'string', example: '2025-12-09T13:39:00.000Z', description: 'Data/Hora ISO' },
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 45, cliente: 2, ip: '10.0.0.5', data: '2025-12-09T13:39:00.000Z' } }
    }
  })
  async registroLogAcessoUsuario(@Body() body: LogAcessoUsuarioInput): Promise<boolean> {
    return this.accountService.registroLogAcessoUsuario(
      body.usuario, body.cliente, body.ip, new Date(body.data)
    );
  }

  @Post('verificaQuantidadeLogoutIncorreto')
  @ApiOperation({ summary: 'Consulta quantidade de logouts incorretos.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 45, description: 'ID do usuário' },
        cliente: { type: 'number', example: 2, description: 'ID do cliente' }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 45, cliente: 2 } }
    }
  })
  async verificaQuantidadeLogoutIncorreto(@Body() body: { usuario: number, cliente: number }): Promise<number> {
    return this.accountService.verificaQuantidadeLogoutIncorreto(body.usuario, body.cliente);
  }

  @Post('bloqueioHorarioInvalidoUsuario')
  @ApiOperation({ summary: 'Bloqueia acessos inválidos.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 45, description: 'ID do usuário' },
        cliente: { type: 'number', example: 2, description: 'ID do cliente' }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 45, cliente: 2 } }
    }
  })
  async bloqueioHorarioInvalidoUsuario(@Body() body: BloqueioHorarioInvalidoUsuarioInput): Promise<boolean> {
    return this.accountService.bloqueioHorarioInvalidoUsuario(body.usuario, body.cliente);
  }

  @Post('carregarPausas')
  @ApiOperation({ summary: 'Lista as pausas disponíveis.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 101, description: '(apenas log)' },
        cliente: { type: 'number', example: 77, description: '(apenas log)' },
        empresa: { type: 'number', example: 56, description: 'ID da empresa para buscar as pausas' }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 101, cliente: 77, empresa: 56 } }
    }
  })
  @ApiOkResponse({ type: [PausaDto] })
  async carregarPausas(@Body() body: CarregarPausasInput): Promise<PausaDto[]> {
    return this.accountService.carregarPausas(body.usuario, body.cliente, body.empresa);
  }

  @Post('registraLogControleHorario')
  @ApiOperation({ summary: 'Registra controle de horário.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 222, description: 'ID do usuário' },
        cliente: { type: 'number', example: 55, description: '(apenas log)' },
        acesso: { type: 'number', example: 1, description: 'Tipo do acesso (inteiro)' },
        projeto: { type: 'number', example: 4, description: 'ID do projeto' },
        data: { type: 'string', example: '2025-12-09T13:43:00.000Z', description: 'Data/hora do login (ISO 8601)' }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 222, cliente: 55, acesso: 1, projeto: 4, data: '2025-12-09T13:43:00.000Z' } }
    }
  })
  async registraLogControleHorario(@Body() body: RegistraLogControleHorarioInput): Promise<number> {
    return this.accountService.registraLogControleHorario(
      body.usuario, body.cliente, body.acesso, body.projeto, new Date(body.data)
    );
  }

  @Post('carregarListaClientesMenu')
  @ApiOperation({ summary: 'Lista clientes disponíveis no menu.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 55, description: 'ID do usuário' },
        matriz: { type: 'number', example: 1, description: 'ID da matriz a ser excluída' }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 55, matriz: 1 } }
    }
  })
  @ApiOkResponse({ type: [ClienteMenuDto] })
  async carregarListaClientesMenu(@Body() body: CarregarListaClientesMenuInput): Promise<ClienteMenuDto[]> {
    return this.accountService.carregarListaClientesMenu(body.usuario, body.matriz);
  }

  @Post('carregarModulos')
  @ApiOperation({ summary: 'Lista módulos do usuário.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 12, description: 'ID do usuário' },
        cliente: { type: 'number', example: 33, description: 'ID do cliente' }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 12, cliente: 33 } }
    }
  })
  @ApiOkResponse({ type: [MenuDto] })
  async carregarModulos(@Body() body: CarregarModulosInput): Promise<MenuDto[]> {
    return this.accountService.carregarModulos(body.usuario, body.cliente);
  }

  @Post('carregarGrupos')
  @ApiOperation({ summary: 'Lista grupos do usuário e módulo.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 78, description: 'ID do usuário' },
        modulo: { type: 'number', example: 3, description: 'ID do módulo' }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 78, modulo: 3 } }
    }
  })
  @ApiOkResponse({ type: [MenuDto] })
  async carregarGrupos(@Body() body: CarregarGruposInput): Promise<MenuDto[]> {
    return this.accountService.carregarGrupos(body.usuario, body.modulo);
  }

  @Post('carregarSubGrupos')
  @ApiOperation({ summary: 'Lista subgrupos do usuário e grupo.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 78, description: 'ID do usuário' },
        grupo: { type: 'number', example: 5, description: 'ID do grupo' }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 78, grupo: 5 } }
    }
  })
  @ApiOkResponse({ type: [MenuDto] })
  async carregarSubGrupos(@Body() body: CarregarSubGruposInput): Promise<MenuDto[]> {
    return this.accountService.carregarSubGrupos(body.usuario, body.grupo);
  }

  @Post('carregaPermissoes')
  @ApiOperation({ summary: 'Carrega permissões por grupo de acesso.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 87 },
        cliente: { type: 'number', example: 50 },
        permissao: { type: 'number', example: 3 }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 87, cliente: 50, permissao: 3 } }
    }
  })
  @ApiOkResponse({ type: PermissaoDto })
  async carregaPermissoes(@Body() body: CarregaPermissoesInput): Promise<PermissaoDto | null> {
    return this.accountService.carregaPermissoes(body.usuario, body.cliente, body.permissao);
  }

  @Post('carregarDadosCliente')
  @ApiOperation({ summary: 'Consulta dados do cliente.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 192 },
        cliente: { type: 'number', example: 29 }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 192, cliente: 29 } }
    }
  })
  @ApiOkResponse({ type: ClienteDto })
  async carregarDadosCliente(@Body() body: CarregarDadosClienteInput): Promise<ClienteDto | null> {
    return this.accountService.carregarDadosCliente(body.usuario, body.cliente);
  }

  @Post('updateClienteLogAcessoUsuario')
  @ApiOperation({ summary: 'Atualiza o cliente no log de acesso.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 192 },
        cliente: { type: 'number', example: 22 }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 192, cliente: 22 } }
    }
  })
  async updateClienteLogAcessoUsuario(@Body() body: UpdateClienteLogAcessoUsuarioInput): Promise<boolean> {
    return this.accountService.updateClienteLogAcessoUsuario(body.usuario, body.cliente);
  }

  @Post('excluirLogAcessoUsuario')
  @ApiOperation({ summary: 'Exclui log de acesso do usuário.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 22 },
        cliente: { type: 'number', example: 6 }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 22, cliente: 6 } }
    }
  })
  async excluirLogAcessoUsuario(@Body() body: ExcluirLogAcessoUsuarioInput): Promise<boolean> {
    return this.accountService.excluirLogAcessoUsuario(body.usuario, body.cliente);
  }

  @Post('registarLogoutControleHorario')
  @ApiOperation({ summary: 'Registra logout no controle de horário.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 45 },
        cliente: { type: 'number', example: 6 },
        acesso: { type: 'number', example: 100 },
        tipo_acesso: { type: 'number', example: 9 }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 45, cliente: 6, acesso: 100, tipo_acesso: 9 } }
    }
  })
  async registarLogoutControleHorario(@Body() body: RegistarLogoutControleHorarioInput): Promise<boolean> {
    return this.accountService.registarLogoutControleHorario(
      body.usuario, body.cliente, body.acesso, body.tipo_acesso
    );
  }

  @Post('registrarIntervaloControleHorario')
  @ApiOperation({ summary: 'Registra início de intervalo de controle.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 16 },
        cliente: { type: 'number', example: 8 },
        projeto: { type: 'number', example: 2 },
        acesso: { type: 'number', example: 99 },
        tipo_acesso: { type: 'number', example: 7 }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 16, cliente: 8, projeto: 2, acesso: 99, tipo_acesso: 7 } }
    }
  })
  @ApiOkResponse({ type: IntervaloControleHorarioDto })
  async registrarIntervaloControleHorario(@Body() body: RegistrarIntervaloControleHorarioInput): Promise<IntervaloControleHorarioDto> {
    return this.accountService.registrarIntervaloControleHorario(
      body.usuario, body.cliente, body.projeto, body.acesso, body.tipo_acesso
    );
  }

  @Post('registrarSaidaIntervaloControleHorario')
  @ApiOperation({ summary: 'Registra saída de intervalo de controle.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 33 },
        cliente: { type: 'number', example: 17 },
        projeto: { type: 'number', example: 5 },
        acesso: { type: 'number', example: 99 },
        tipo: { type: 'number', example: 11 }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 33, cliente: 17, projeto: 5, acesso: 99, tipo: 11 } }
    }
  })
  @ApiOkResponse({ type: SaidaIntervaloControleHorarioDto })
  async registrarSaidaIntervaloControleHorario(@Body() body: RegistrarSaidaIntervaloControleHorarioInput): Promise<SaidaIntervaloControleHorarioDto> {
    return this.accountService.registrarSaidaIntervaloControleHorario(
      body.usuario, body.cliente, body.projeto, body.acesso, body.tipo
    );
  }

  @Post('registrarPausaControleHorario')
  @ApiOperation({ summary: 'Registra pausa no controle de horário.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 12 },
        cliente: { type: 'number', example: 3 },
        projeto: { type: 'number', example: 8 },
        acesso: { type: 'number', example: 42 },
        tipo_acesso: { type: 'number', example: 15 },
        pausa: { type: 'number', example: 5 }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 12, cliente: 3, projeto: 8, acesso: 42, tipo_acesso: 15, pausa: 5 } }
    }
  })
  @ApiOkResponse({ type: PausaControleHorarioDto })
  async registrarPausaControleHorario(@Body() body: RegistrarPausaControleHorarioInput): Promise<PausaControleHorarioDto> {
    return this.accountService.registrarPausaControleHorario(
      body.usuario, body.cliente, body.projeto, body.acesso, body.tipo_acesso, body.pausa
    );
  }

  @Post('registrarSaidaPausaControleHorario')
  @ApiOperation({ summary: 'Registra saída de pausa do controle de horário.' })
  @ApiBody({
    schema: {
      properties: {
        usuario: { type: 'number', example: 22 },
        cliente: { type: 'number', example: 44 },
        projeto: { type: 'number', example: 19 },
        acesso: { type: 'number', example: 42 },
        tipo: { type: 'number', example: 8 }
      }
    },
    examples: {
      'Exemplo': { value: { usuario: 22, cliente: 44, projeto: 19, acesso: 42, tipo: 8 } }
    }
  })
  @ApiOkResponse({ type: SaidaIntervaloControleHorarioDto })
  async registrarSaidaPausaControleHorario(@Body() body: RegistrarSaidaPausaControleHorarioInput): Promise<SaidaIntervaloControleHorarioDto> {
    return this.accountService.registrarSaidaPausaControleHorario(
      body.usuario, body.cliente, body.projeto, body.acesso, body.tipo
    );
  }
}
