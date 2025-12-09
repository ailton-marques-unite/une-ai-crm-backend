import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from '../application/services/account.service';
import { Login } from '../domain/entities/login.entity';
import { Usuario } from '../domain/entities/usuario.entity';
import { Cliente } from '../domain/entities/cliente.entity';
import { Empresa } from '../domain/entities/empresa.entity';
import { Cargo } from '../domain/entities/cargo.entity';
import { Departamento } from '../domain/entities/departamento.entity';
import { UsuarioControle } from '../domain/entities/usuario-controle.entity';
import { UsuarioXPermissao } from '../domain/entities/usuario-x-permissao.entity';
import { PermissaoUsuarioXSubGrupo } from '../domain/entities/permissao-usuario-x-subgrupo.entity';
import { GrupoAcessoUsuario } from '../domain/entities/grupo-acesso-usuario.entity';
import { AcessoUsuario } from '../domain/entities/acesso-usuario.entity';
import { UsuarioAutenticacao } from '../domain/entities/usuario-autenticacao.entity';
import { Email } from '../domain/entities/email.entity';
import { HistoricoSenha } from '../domain/entities/historico-senha.entity';
import { AcessoUsuarioCelular } from '../domain/entities/acesso-usuario-celular.entity';
import { UsuarioAcesso } from '../domain/entities/usuario-acesso.entity';
import { UsuarioPausa } from '../domain/entities/usuario-pausa.entity';
import { UsuarioMultiAcesso } from '../domain/entities/usuario-multi-acesso.entity';
import { SubGrupo } from '../domain/entities/subgrupo.entity';
import { Grupo } from '../domain/entities/grupo.entity';
import { Modulo } from '../domain/entities/modulo.entity';
import { ModuloXCliente } from '../domain/entities/modulo-x-cliente.entity';
import { AccountRepository } from './repositories/account.repository';
import { AccountController } from './controllers/account.controller';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Login,
      Usuario,
      Cliente,
      Empresa,
      Cargo,
      Departamento,
      UsuarioControle,
      UsuarioXPermissao,
      PermissaoUsuarioXSubGrupo,
      GrupoAcessoUsuario,
      AcessoUsuario,
      UsuarioAutenticacao,
      Email,
      HistoricoSenha,
      AcessoUsuarioCelular,
      UsuarioAcesso,
      UsuarioPausa,
      UsuarioMultiAcesso,
      SubGrupo,
      Grupo,
      Modulo,
      ModuloXCliente,
    ]),
  ],
  providers: [AccountService, AccountRepository],
  controllers: [AccountController],
  exports: [AccountService, AccountRepository],
})
export class AccountModule {}

