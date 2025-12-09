# Conversão de Query SQL para TypeORM

Este diretório contém exemplos de como converter queries SQL dos métodos `CarregarDadosUsuarioValidacao`, `ValidaLogin`, `CarregarDadosUsuario`, `AtualizaErroSenha`, `VerificaCodigoAutenticacaoUsuarioExiste`, `CarregarDadosCodigoAutenticacao`, `ArmazenaCodigoAutenticacaoUsuario`, `CarregaParametrosEmail`, `VerificaNomeUsuarioExiste`, `VerificaSenhaUsadaAnteriormente`, `SalvarSenhaUsuario`, `RegistroLogAcessoCelular`, `RegistroLogAcessoUsuario`, `VerificaQuantidadeLogoutIncorreto`, `BloqueioHorarioInvalidoUsuario`, `CarregarPausas`, `RegistraLogControleHorario`, `CarregarListaClientesMenu`, `CarregarModulos`, `CarregarGrupos`, `CarregarSubGrupos`, `CarregaPermissoes`, `CarregarDadosCliente`, `UpdateClienteLogAcessoUsuario`, `ExcluirLogAcessoUsuario`, `RegistarLogoutControleHorario`, `RegistrarIntervaloControleHorario`, `RegistrarSaidaIntervaloControleHorario`, `RegistrarPausaControleHorario` e `RegistrarSaidaPausaControleHorario` do C# para TypeORM + NestJS.

## Estrutura

- **entities/**: Entidades TypeORM mapeadas para as tabelas do banco
- **dto/**: DTOs para tipagem dos dados de retorno
- **services/**: Serviço NestJS com o método convertido
- **account.module.ts**: Módulo NestJS configurado

## Queries Originais (C#)

### 1. CarregarDadosUsuarioValidacao

```sql
SELECT C.Id_Empresa, E.nm_Fantasia, U.Id_Cliente, L.Id_Usuario, 
       L.fl_Primeiro_Acesso, L.dt_Ultima_Senha, L.ds_Usuario, L.ds_Email, U.nm_Usuario 
FROM security.tbl_Login AS L WITH (NOLOCK) 
INNER JOIN security.tbl_Usuario AS U WITH (NOLOCK) ON (L.Id_Usuario = U.Id_Usuario) 
INNER JOIN global.tbl_Cliente AS C WITH (NOLOCK) ON (U.Id_Cliente = C.Id_Cliente) 
INNER JOIN global.tbl_Empresa AS E WITH (NOLOCK) ON (C.Id_Empresa = E.Id_Empresa) 
WHERE U.fl_Excluido = 'N' 
AND (L.ds_Usuario = @usuario OR L.ds_Email = @usuario) -- dependendo do tipo
AND E.fl_Excluido = 0 
AND E.fl_Ativo = 1 
ORDER BY E.nm_Fantasia ASC
```

### 2. ValidaLogin

```sql
SELECT U.Id_Cliente, L.Id_Usuario, L.ds_Usuario, L.ds_Email, L.ds_Password, U.fl_Excluido 
FROM security.tbl_Login AS L WITH (NOLOCK) 
INNER JOIN security.tbl_Usuario AS U WITH (NOLOCK) ON (L.Id_Usuario = U.Id_Usuario)
WHERE U.fl_Excluido = 'N' 
AND (L.ds_Usuario = @usuario OR L.ds_Email = @usuario) -- dependendo do tipo
```

### 3. CarregarDadosUsuario

```sql
SELECT CL.Id_Empresa, CL.Id_Cliente, CL.nm_Fantasia, CL.Id_Matriz, CL.fl_Filial, 
       CL.fl_MultiAcesso AS fl_MultiAcessoCliente, CL.fl_Mascarar_Campos_Lgpd, CL.fl_Higienizacao_Lead, 
       CL.fl_Sobre_Lead, U.fl_Adm, U.Id_Usuario, U.nm_Usuario, U.fl_MultiAcesso, L.ds_Usuario, L.ds_Email, 
       L.ds_Password, L.dt_Ultima_Senha, L.nu_Erro_Senha, D.ds_Departamento, C.ds_Cargo, C.tp_Cargo, G.Id_GrupoAcessoUsuario, 
       O.id_ordem, U.st_Usuario, U.hs_AcessoInicial, U.hs_AcessoFinal, U.fl_Excluido, AC.ds_IP, P.fl_Supervisao, 
       P.fl_Alterar_Lead, E.nu_DDI, P.fl_PermitirCaptura, P.fl_PermitirChat, P.fl_PermitirReceptivo, P.fl_PermitirRetornoMkt, 
       P.fl_PermitirTarefa, P.fl_LogarSemRamal, P.fl_ControleHorario, P.fl_LogoutAutomatico, P.fl_ExcluirMemoriaAtendimento, 
       P.fl_VisualizarCamposLgpd, P.fl_HigienizarLead, P.fl_UtilizaGravacao, P.fl_PopUpRetorno, U.tp_Acesso, UC.id_Projeto, U.tp_Funil, U.ds_Funil 
FROM security.tbl_Usuario AS U WITH (NOLOCK) 
INNER JOIN security.tbl_Login AS L WITH (NOLOCK) ON (U.Id_Usuario = L.Id_Usuario) 
LEFT JOIN security.tbl_UsuarioControle AS UC WITH (NOLOCK) ON (U.Id_Usuario = UC.id_Usuario) 
INNER JOIN security.tbl_UsuarioXPermissao AS P WITH (NOLOCK) ON (U.Id_Usuario = P.Id_Usuario) 
INNER JOIN global.tbl_Cargo AS C WITH (NOLOCK) ON (U.Id_Cargo = C.Id_Cargo) 
INNER JOIN global.tbl_Departamento AS D WITH (NOLOCK) ON (U.Id_Departamento = D.Id_Departamento) 
INNER JOIN security.tbl_PermissaoUsuarioXSubGrupo AS G WITH (NOLOCK) ON (U.Id_Usuario = G.Id_Usuario) 
INNER JOIN security.tbl_GrupoAcessoUsuario AS O WITH (NOLOCK) ON (G.Id_GrupoAcessoUsuario = O.Id_GrupoAcessoUsuario) 
INNER JOIN global.tbl_Cliente AS CL WITH (NOLOCK) ON (U.Id_Cliente = CL.Id_Cliente) 
INNER JOIN global.tbl_Empresa AS E WITH (NOLOCK) ON (CL.Id_Empresa = E.Id_Empresa) 
LEFT JOIN Logapp.tbl_AcessoUsuario AS AC WITH (NOLOCK) ON (U.Id_Usuario = AC.Id_Usuario) 
WHERE U.Id_Usuario = @usuario 
GROUP BY [todos os campos selecionados]
```

### 4. AtualizaErroSenha

```sql
UPDATE security.tbl_Login SET 
  nu_Erro_Senha = nu_Erro_Senha + 1  -- se erro == true
  ou nu_Erro_Senha = 0                -- se erro == false
WHERE Id_Usuario = @usuario
```

### 5. VerificaCodigoAutenticacaoUsuarioExiste

```sql
SELECT COUNT(id_Autenticacao) 
FROM security.tbl_UsuarioAutenticacao WITH (NOLOCK) 
WHERE id_Empresa = @empresa 
AND id_Usuario = @usuario
```

### 6. CarregarDadosCodigoAutenticacao

```sql
SELECT dt_Modificacao, id_Empresa, id_Usuario, ds_Codigo 
FROM security.tbl_UsuarioAutenticacao WITH (NOLOCK) 
WHERE id_Empresa = @empresa 
AND id_Usuario = @usuario
```

### 7. ArmazenaCodigoAutenticacaoUsuario

```sql
-- Se atualizar == false:
INSERT INTO security.tbl_UsuarioAutenticacao (dt_Criacao, dt_Modificacao, id_Empresa, id_Usuario, ds_Codigo) 
VALUES (@data, @data, @empresa, @usuario, @codigo)

-- Se atualizar == true:
UPDATE security.tbl_UsuarioAutenticacao SET 
  dt_Modificacao = @data, 
  ds_Codigo = @codigo 
WHERE id_Empresa = @empresa 
AND id_Usuario = @usuario
```

### 8. CarregaParametrosEmail

```sql
SELECT ds_Email, ds_Smtp, nu_Porta_Smtp, fl_SSL, ds_Nome_Saida, 
       ds_Email_Saida, ds_Email_Resposta, ds_Usuario, ds_Password, ds_Token 
FROM admin.tbl_Email WITH (NOLOCK)
```

### 9. VerificaNomeUsuarioExiste

```sql
SELECT COUNT(L.Id_Login) 
FROM security.tbl_Login AS L WITH (NOLOCK) 
INNER JOIN security.tbl_Usuario AS U WITH (NOLOCK) ON (L.Id_Usuario = U.Id_Usuario) 
INNER JOIN global.tbl_Cliente AS C WITH (NOLOCK) ON (U.Id_Cliente = C.Id_Cliente) 
WHERE C.Id_Empresa = @empresa 
AND L.ds_Usuario = @nomeUsuario
```

### 10. VerificaSenhaUsadaAnteriormente

```sql
SELECT COUNT(id_Senha) 
FROM security.tbl_HistoricoSenha WITH (NOLOCK) 
WHERE id_Usuario = @usuario 
AND ds_Password = @senha
```

### 11. SalvarSenhaUsuario

```sql
-- 1. UPDATE security.tbl_Login SET 
--    dt_Modificacao = @data, 
--    dt_Ultima_Senha = @data, 
--    nu_Erro_Senha = 0, 
--    fl_Primeiro_Acesso = 0 (se primeiro_acesso == true),
--    ds_Usuario = @nome (se nome_usuario não for vazio),
--    ds_Password = @senha 
--    WHERE Id_Usuario = @usuario
-- 
-- 2. INSERT INTO security.tbl_HistoricoSenha (dt_Criacao, id_Usuario, ds_Password) 
--    VALUES (@data, @usuario, @senha)
```

### 12. RegistroLogAcessoCelular

```sql
INSERT INTO Logapp.tbl_AcessoUsuarioCelular (dt_Data, Id_Usuario, ds_IP, ds_Info, Id_Cliente) 
VALUES (@data, @usuario, @ip, @info, @cliente)
```

### 13. RegistroLogAcessoUsuario

```sql
INSERT INTO Logapp.tbl_AcessoUsuario (dt_Data, Id_Usuario, ds_IP, Id_Cliente) 
VALUES (@data, @usuario, @ip, @cliente)
```

### 14. VerificaQuantidadeLogoutIncorreto

```sql
SELECT COUNT(id_Acesso) 
FROM security.tbl_UsuarioAcesso WITH (NOLOCK) 
WHERE id_Usuario = @usuario 
AND fl_Logout = 0 
AND fl_Bloqueado = 1
```

### 15. BloqueioHorarioInvalidoUsuario

```sql
UPDATE security.tbl_UsuarioAcesso SET 
fl_Bloqueado = 1 
WHERE id_Usuario = @usuario 
AND fl_Logout = 0 
AND dt_Logout IS NULL
```

### 16. CarregarPausas

```sql
SELECT id_Empresa, id_Pausa, ds_Pausa 
FROM security.tbl_UsuarioPausa WITH (NOLOCK) 
WHERE id_Empresa = @empresa 
AND fl_Excluiu = 'N' 
AND fl_Ativo = 1 
ORDER BY ds_Pausa ASC
```

### 17. RegistraLogControleHorario

```sql
INSERT INTO security.tbl_UsuarioAcesso (tp_Acesso, id_Usuario, id_Projeto, tp_Login, dt_Login) 
VALUES (@acesso, @usuario, @projeto, 1, @data) 
SELECT SCOPE_IDENTITY()
```

**Nota**: Se `acesso != 3`, insere o valor de `@acesso`, senão insere `DBNull.Value` (null).

### 18. CarregarListaClientesMenu

```sql
SELECT M.Id_Cliente, C.nm_Fantasia, M.Id_Usuario 
FROM security.tbl_UsuarioMultiAcesso AS M WITH (NOLOCK) 
INNER JOIN global.tbl_Cliente AS C WITH (NOLOCK) ON (M.Id_Cliente = C.Id_Cliente) 
WHERE M.Id_Usuario = @usuario 
AND C.fl_Excluido = 'N' 
AND C.fl_Filial = 0 
AND C.Id_Cliente <> @matriz 
ORDER BY C.nm_Fantasia ASC
```

## Implementação TypeORM

Os métodos no `AccountService` implementam a mesma lógica usando:

1. **QueryBuilder**: Controle total sobre a query (recomendado para queries complexas)
2. **Relations**: Abordagem mais simples usando find() com relations (alternativa)

## Uso

```typescript
// No seu controller ou outro serviço
constructor(private readonly accountService: AccountService) {}

async exemplo() {
  // tipo = 1: busca por nome de usuário
  // tipo = 2: busca por email
  
  // CarregarDadosUsuarioValidacao - retorna array
  const usuarios = await this.accountService.carregarDadosUsuarioValidacao(1, 'nomeusuario');
  
  // ValidaLogin - retorna objeto único ou null
  const login = await this.accountService.validaLogin(1, 'nomeusuario');
  if (login) {
    console.log(login.id_Usuario, login.ds_Password, login.id_Cliente, login.ds_Email);
  }
  
  // CarregarDadosUsuario - retorna objeto completo do usuário ou null
  const usuario = await this.accountService.carregarDadosUsuario(123);
  if (usuario) {
    console.log(usuario.nm_Usuario, usuario.ds_Email, usuario.fl_Adm);
  }
  
  // AtualizaErroSenha - atualiza contador de erros de senha
  const sucesso = await this.accountService.atualizaErroSenha(123, true); // incrementa erro
  // ou
  const sucesso2 = await this.accountService.atualizaErroSenha(123, false); // zera erro
  
  // VerificaCodigoAutenticacaoUsuarioExiste - verifica se existe código de autenticação
  const existe = await this.accountService.verificaCodigoAutenticacaoUsuarioExiste(1, 123);
  if (existe) {
    console.log('Código de autenticação existe para este usuário');
  }
  
  // CarregarDadosCodigoAutenticacao - carrega dados do código de autenticação
  const autenticacao = await this.accountService.carregarDadosCodigoAutenticacao(1, 123);
  if (autenticacao) {
    console.log(autenticacao.ds_Codigo, autenticacao.dt_Modificacao);
  }
  
  // ArmazenaCodigoAutenticacaoUsuario - armazena ou atualiza código de autenticação
  const sucesso = await this.accountService.armazenaCodigoAutenticacaoUsuario(1, 123, 'ABC123', false); // INSERT
  // ou
  const sucesso2 = await this.accountService.armazenaCodigoAutenticacaoUsuario(1, 123, 'XYZ789', true); // UPDATE
  
  // CarregaParametrosEmail - carrega parâmetros de configuração de email
  const emailConfig = await this.accountService.carregaParametrosEmail();
  if (emailConfig) {
    console.log(emailConfig.ds_Smtp, emailConfig.nu_Porta_Smtp, emailConfig.fl_SSL);
  }
  
  // VerificaNomeUsuarioExiste - verifica se nome de usuário já existe na empresa
  const existe = await this.accountService.verificaNomeUsuarioExiste(1, 123, 'nomeusuario');
  if (existe) {
    console.log('Nome de usuário já existe');
  }
  
  // VerificaSenhaUsadaAnteriormente - verifica se senha já foi usada anteriormente
  const senhaUsada = await this.accountService.verificaSenhaUsadaAnteriormente(123, 'senha123');
  if (senhaUsada) {
    console.log('Esta senha já foi usada anteriormente');
  }
  
  // SalvarSenhaUsuario - salva nova senha e registra no histórico
  const sucesso = await this.accountService.salvarSenhaUsuario(1, 123, 'nomeusuario', 'novaSenha123', false);
  // ou sem nome de usuário
  const sucesso2 = await this.accountService.salvarSenhaUsuario(1, 123, null, 'novaSenha123', true);
  
  // RegistroLogAcessoCelular - registra log de acesso via celular
  const logSucesso = await this.accountService.registroLogAcessoCelular(123, 456, '192.168.1.1', new Date(), 'Info adicional');
  
  // RegistroLogAcessoUsuario - registra log de acesso do usuário
  const logUsuarioSucesso = await this.accountService.registroLogAcessoUsuario(123, 456, '192.168.1.1', new Date());
  
  // VerificaQuantidadeLogoutIncorreto - verifica quantidade de acessos com logout incorreto
  const quantidade = await this.accountService.verificaQuantidadeLogoutIncorreto(123, 456);
  console.log(`Quantidade de logout incorreto: ${quantidade}`);
  
  // BloqueioHorarioInvalidoUsuario - bloqueia acessos com horário inválido
  const bloqueado = await this.accountService.bloqueioHorarioInvalidoUsuario(123, 456);
  if (bloqueado) {
    console.log('Acessos com horário inválido foram bloqueados');
  }
  
  // CarregarPausas - carrega lista de pausas disponíveis
  const pausas = await this.accountService.carregarPausas(123, 456, 1);
  pausas.forEach((pausa) => {
    console.log(`${pausa.id_Pausa}: ${pausa.ds_Pausa}`);
  });
  
  // RegistraLogControleHorario - registra log de controle de horário e retorna ID
  const idAcesso = await this.accountService.registraLogControleHorario(123, 456, 1, 789, new Date());
  console.log(`ID do acesso registrado: ${idAcesso}`);
  
  // CarregarListaClientesMenu - carrega lista de clientes para o menu
  const clientes = await this.accountService.carregarListaClientesMenu(123, 456);
  clientes.forEach((cliente) => {
    console.log(`${cliente.id_Cliente}: ${cliente.nm_Fantasia}`);
  });
  
  // CarregarModulos - carrega módulos disponíveis para o usuário
  const modulos = await this.accountService.carregarModulos(123, 456);
  modulos.forEach((modulo) => {
    console.log(`${modulo.id_Modulo}: ${modulo.ds_Modulo} (${modulo.ic_Modulo})`);
  });
  
  // CarregarGrupos - carrega grupos disponíveis para o usuário em um módulo específico
  const grupos = await this.accountService.carregarGrupos(123, 1);
  grupos.forEach((grupo) => {
    console.log(`${grupo.id_Grupo}: ${grupo.ds_Grupo} (${grupo.ic_Grupo})`);
  });
  
  // CarregarSubGrupos - carrega subgrupos disponíveis para o usuário em um grupo específico
  const subgrupos = await this.accountService.carregarSubGrupos(123, 5);
  subgrupos.forEach((subgrupo) => {
    console.log(`${subgrupo.id_SubGrupo}: ${subgrupo.ds_SubGrupo} (${subgrupo.ds_Pasta}/${subgrupo.ds_View})`);
  });
  
  // CarregaPermissoes - carrega permissões de um grupo de acesso
  const permissoes = await this.accountService.carregaPermissoes(123, 456, 1);
  if (permissoes) {
    console.log(`Incluir: ${permissoes.fl_Incluir}, Alterar: ${permissoes.fl_Alterar}, Excluir: ${permissoes.fl_Excluir}, Pesquisar: ${permissoes.fl_Pesquisar}`);
  }
  
  // CarregarDadosCliente - carrega dados básicos de um cliente
  const cliente = await this.accountService.carregarDadosCliente(123, 456);
  if (cliente) {
    console.log(`${cliente.id_Cliente}: ${cliente.nm_Fantasia} (Matriz: ${cliente.id_Matriz}, Filial: ${cliente.fl_Filial})`);
  }
  
  // UpdateClienteLogAcessoUsuario - atualiza o cliente no log de acesso do usuário
  const atualizado = await this.accountService.updateClienteLogAcessoUsuario(123, 456);
  console.log(`Cliente atualizado no log: ${atualizado}`);
  
  // ExcluirLogAcessoUsuario - exclui o log de acesso do usuário
  const excluido = await this.accountService.excluirLogAcessoUsuario(123, 456);
  console.log(`Log de acesso excluído: ${excluido}`);
  
  // RegistarLogoutControleHorario - registra logout no controle de horário
  const logoutRegistrado = await this.accountService.registarLogoutControleHorario(123, 456, 789, 1);
  console.log(`Logout registrado: ${logoutRegistrado}`);
  
  // RegistrarIntervaloControleHorario - registra intervalo no controle de horário
  const intervalo = await this.accountService.registrarIntervaloControleHorario(123, 456, 789, 1, 2);
  if (intervalo.sucesso) {
    console.log(`Intervalo registrado: ID ${intervalo.registro} em ${intervalo.horario}`);
  }
  
  // RegistrarSaidaIntervaloControleHorario - registra saída de intervalo no controle de horário
  const saidaIntervalo = await this.accountService.registrarSaidaIntervaloControleHorario(123, 456, 789, 1, 2);
  if (saidaIntervalo.sucesso) {
    console.log(`Saída de intervalo registrada: ID ${saidaIntervalo.registro}`);
  }
  
  // RegistrarPausaControleHorario - registra pausa no controle de horário
  const pausa = await this.accountService.registrarPausaControleHorario(123, 456, 789, 1, 2, 5);
  if (pausa.sucesso) {
    console.log(`Pausa registrada: ID ${pausa.registro} em ${pausa.horario}`);
  }
  
  // RegistrarSaidaPausaControleHorario - registra saída de pausa no controle de horário
  const saidaPausa = await this.accountService.registrarSaidaPausaControleHorario(123, 456, 789, 1, 2);
  if (saidaPausa.sucesso) {
    console.log(`Saída de pausa registrada: ID ${saidaPausa.registro}`);
  }
}
```

## Observações

- As entidades usam `@Entity('schema.tabela')` para mapear os schemas do SQL Server
- Os relacionamentos (OneToOne, ManyToOne, OneToMany) são configurados com `@JoinColumn`
- O método retorna um array de DTOs tipados
- A query usa parâmetros nomeados para evitar SQL injection

## Próximos Passos

1. Ajustar os tipos de dados nas entidades conforme seu banco
2. Configurar o TypeORM no `app.module.ts` com a connection string
3. Testar a query e ajustar os mapeamentos se necessário

## Prompt original

@Negocio/NAccount.cs a presente classe @NAccount.cs escrita originalmente em C# precisa passar por um processo de refactoring onde gostariamos de integrar node.js+nest.js+typeorm. O método CarregarDadosUsuarioValidacao(int tipo, string usuario) se utiliza de uma query string na variável (string sql) que monta o script: 
@NAccount.cs (39-56) 
utilizando informações das tabelas security.tbl_Login, security.tbl_Usuario, global.tbl_Cliente e global.tbl_Empresa
e é executado em  SqlCommand cmd = new SqlCommand(sql, conn); com o parâmetro cmd.Parameters.AddWithValue("@usuario", usuario);

Você consegue reproduzir este trecho da query string para que eu possa utilizá-lo em um objeto TypeORM

Analisando a query SQL e convertendo para TypeORM. Criando as entidades e o método equivalente.

## Resumo da conversão

### Query SQL original (C#)
A query nas linhas 39-56 de `NAccount.cs` foi convertida para TypeORM. Foram criados:

### Arquivos criados

1. Entidades TypeORM (`entities/`):
   - `login.entity.ts` - Tabela `security.tbl_Login`
   - `usuario.entity.ts` - Tabela `security.tbl_Usuario` (atualizada com campos adicionais)
   - `cliente.entity.ts` - Tabela `global.tbl_Cliente` (atualizada com campos adicionais)
   - `empresa.entity.ts` - Tabela `global.tbl_Empresa` (atualizada com campo nu_DDI)
   - `cargo.entity.ts` - Tabela `global.tbl_Cargo`
   - `departamento.entity.ts` - Tabela `global.tbl_Departamento`
   - `usuario-controle.entity.ts` - Tabela `security.tbl_UsuarioControle`
   - `usuario-x-permissao.entity.ts` - Tabela `security.tbl_UsuarioXPermissao`
   - `permissao-usuario-x-subgrupo.entity.ts` - Tabela `security.tbl_PermissaoUsuarioXSubGrupo`
   - `grupo-acesso-usuario.entity.ts` - Tabela `security.tbl_GrupoAcessoUsuario`
   - `acesso-usuario.entity.ts` - Tabela `Logapp.tbl_AcessoUsuario`
   - `usuario-autenticacao.entity.ts` - Tabela `security.tbl_UsuarioAutenticacao`
   - `email.entity.ts` - Tabela `admin.tbl_Email`
   - `historico-senha.entity.ts` - Tabela `security.tbl_HistoricoSenha`
   - `acesso-usuario-celular.entity.ts` - Tabela `Logapp.tbl_AcessoUsuarioCelular`
   - `usuario-acesso.entity.ts` - Tabela `security.tbl_UsuarioAcesso`
   - `usuario-pausa.entity.ts` - Tabela `security.tbl_UsuarioPausa`
   - `usuario-multi-acesso.entity.ts` - Tabela `security.tbl_UsuarioMultiAcesso`
   - `subgrupo.entity.ts` - Tabela `global.tbl_SubGrupo`
   - `grupo.entity.ts` - Tabela `global.tbl_Grupo`
   - `modulo.entity.ts` - Tabela `global.tbl_Modulo`
   - `modulo-x-cliente.entity.ts` - Tabela `global.tbl_ModuloXCliente`

2. DTOs (`dto/`):
   - `usuario-validacao.dto.ts` - Define a estrutura de retorno do método `CarregarDadosUsuarioValidacao`
   - `login.dto.ts` - Define a estrutura de retorno do método `ValidaLogin`
   - `usuario.dto.ts` - Define a estrutura de retorno do método `CarregarDadosUsuario`
   - `autenticacao.dto.ts` - Define a estrutura de retorno do método `CarregarDadosCodigoAutenticacao`
   - `email.dto.ts` - Define a estrutura de retorno do método `CarregaParametrosEmail`
   - `pausa.dto.ts` - Define a estrutura de retorno do método `CarregarPausas`
   - `cliente-menu.dto.ts` - Define a estrutura de retorno do método `CarregarListaClientesMenu`
   - `menu.dto.ts` - Define a estrutura de retorno dos métodos `CarregarModulos`, `CarregarGrupos` e `CarregarSubGrupos`
   - `permissao.dto.ts` - Define a estrutura de retorno do método `CarregaPermissoes`
   - `cliente.dto.ts` - Define a estrutura de retorno do método `CarregarDadosCliente`
   - `intervalo-controle-horario.dto.ts` - Define a estrutura de retorno do método `RegistrarIntervaloControleHorario`
   - `saida-intervalo-controle-horario.dto.ts` - Define a estrutura de retorno do método `RegistrarSaidaIntervaloControleHorario`
   - `pausa-controle-horario.dto.ts` - Define a estrutura de retorno do método `RegistrarPausaControleHorario`

3. Serviço NestJS (`services/account.service.ts`):
   - Método `carregarDadosUsuarioValidacao()` equivalente ao C#
   - Método `validaLogin()` equivalente ao C#
   - Método `carregarDadosUsuario()` equivalente ao C#
   - Método `atualizaErroSenha()` equivalente ao C#
   - Método `verificaCodigoAutenticacaoUsuarioExiste()` equivalente ao C#
   - Método `carregarDadosCodigoAutenticacao()` equivalente ao C#
   - Método `armazenaCodigoAutenticacaoUsuario()` equivalente ao C#
   - Método `carregaParametrosEmail()` equivalente ao C#
   - Método `verificaNomeUsuarioExiste()` equivalente ao C#
   - Método `verificaSenhaUsadaAnteriormente()` equivalente ao C#
   - Método `salvarSenhaUsuario()` equivalente ao C#
   - Método `registroLogAcessoCelular()` equivalente ao C#
   - Método `registroLogAcessoUsuario()` equivalente ao C#
   - Método `verificaQuantidadeLogoutIncorreto()` equivalente ao C#
   - Método `bloqueioHorarioInvalidoUsuario()` equivalente ao C#
   - Método `carregarPausas()` equivalente ao C#
   - Método `registraLogControleHorario()` equivalente ao C#
   - Método `carregarListaClientesMenu()` equivalente ao C#
   - Método `carregarModulos()` equivalente ao C#
   - Método `carregarGrupos()` equivalente ao C#
   - Método `carregarSubGrupos()` equivalente ao C#
   - Método `carregaPermissoes()` equivalente ao C#
   - Método `carregarDadosCliente()` equivalente ao C#
   - Método `updateClienteLogAcessoUsuario()` equivalente ao C#
   - Método `excluirLogAcessoUsuario()` equivalente ao C#
   - Método `registarLogoutControleHorario()` equivalente ao C#
   - Método `registrarIntervaloControleHorario()` equivalente ao C#
   - Método `registrarSaidaIntervaloControleHorario()` equivalente ao C#
   - Método `registrarPausaControleHorario()` equivalente ao C#
   - Método `registrarSaidaPausaControleHorario()` equivalente ao C#
   - Duas implementações para `carregarDadosUsuarioValidacao`: QueryBuilder (recomendado) e Relations

4. Módulo NestJS (`account.module.ts`):
   - Configuração do módulo com TypeORM

5. Exemplos diretos:
   - `query-exemplo.ts` - Query TypeORM pronta para `CarregarDadosUsuarioValidacao`
   - `query-valida-login-exemplo.ts` - Query TypeORM pronta para `ValidaLogin`
   - `query-carregar-dados-usuario-exemplo.ts` - Query TypeORM pronta para `CarregarDadosUsuario`
   - `query-atualiza-erro-senha-exemplo.ts` - Query TypeORM pronta para `AtualizaErroSenha`
   - `query-verifica-codigo-autenticacao-exemplo.ts` - Query TypeORM pronta para `VerificaCodigoAutenticacaoUsuarioExiste`
   - `query-carregar-dados-codigo-autenticacao-exemplo.ts` - Query TypeORM pronta para `CarregarDadosCodigoAutenticacao`
   - `query-armazena-codigo-autenticacao-exemplo.ts` - Query TypeORM pronta para `ArmazenaCodigoAutenticacaoUsuario`
   - `query-carrega-parametros-email-exemplo.ts` - Query TypeORM pronta para `CarregaParametrosEmail`
   - `query-verifica-nome-usuario-existe-exemplo.ts` - Query TypeORM pronta para `VerificaNomeUsuarioExiste`
   - `query-verifica-senha-usada-anteriormente-exemplo.ts` - Query TypeORM pronta para `VerificaSenhaUsadaAnteriormente`
   - `query-salvar-senha-usuario-exemplo.ts` - Query TypeORM pronta para `SalvarSenhaUsuario`
   - `query-registro-log-acesso-celular-exemplo.ts` - Query TypeORM pronta para `RegistroLogAcessoCelular`
   - `query-registro-log-acesso-usuario-exemplo.ts` - Query TypeORM pronta para `RegistroLogAcessoUsuario`
   - `query-verifica-quantidade-logout-incorreto-exemplo.ts` - Query TypeORM pronta para `VerificaQuantidadeLogoutIncorreto`
   - `query-bloqueio-horario-invalido-usuario-exemplo.ts` - Query TypeORM pronta para `BloqueioHorarioInvalidoUsuario`
   - `query-carregar-pausas-exemplo.ts` - Query TypeORM pronta para `CarregarPausas`
   - `query-registra-log-controle-horario-exemplo.ts` - Query TypeORM pronta para `RegistraLogControleHorario`
   - `query-carregar-lista-clientes-menu-exemplo.ts` - Query TypeORM pronta para `CarregarListaClientesMenu`
   - `query-carregar-modulos-exemplo.ts` - Query TypeORM pronta para `CarregarModulos`
   - `query-carregar-grupos-exemplo.ts` - Query TypeORM pronta para `CarregarGrupos`
   - `query-carregar-subgrupos-exemplo.ts` - Query TypeORM pronta para `CarregarSubGrupos`
   - `query-carrega-permissoes-exemplo.ts` - Query TypeORM pronta para `CarregaPermissoes`
   - `query-carregar-dados-cliente-exemplo.ts` - Query TypeORM pronta para `CarregarDadosCliente`
   - `query-update-cliente-log-acesso-usuario-exemplo.ts` - Query TypeORM pronta para `UpdateClienteLogAcessoUsuario`
   - `query-excluir-log-acesso-usuario-exemplo.ts` - Query TypeORM pronta para `ExcluirLogAcessoUsuario`
   - `query-registar-logout-controle-horario-exemplo.ts` - Query TypeORM pronta para `RegistarLogoutControleHorario`
   - `query-registrar-intervalo-controle-horario-exemplo.ts` - Query TypeORM pronta para `RegistrarIntervaloControleHorario`
   - `query-registrar-saida-intervalo-controle-horario-exemplo.ts` - Query TypeORM pronta para `RegistrarSaidaIntervaloControleHorario`
   - `query-registrar-pausa-controle-horario-exemplo.ts` - Query TypeORM pronta para `RegistrarPausaControleHorario`
   - `query-registrar-saida-pausa-controle-horario-exemplo.ts` - Query TypeORM pronta para `RegistrarSaidaPausaControleHorario`

### Implementação principal

O método usa QueryBuilder do TypeORM para replicar a query SQL:

```typescript
const queryBuilder = this.loginRepository
  .createQueryBuilder('L')
  .innerJoin('L.usuario', 'U')
  .innerJoin('U.cliente', 'C')
  .innerJoin('C.empresa', 'E')
  .select([...campos...])
  .where('U.fl_Excluido = :flExcluido', { flExcluido: 'N' })
  .andWhere('E.fl_Excluido = :flExcluidoEmpresa', { flExcluidoEmpresa: 0 })
  .andWhere('E.fl_Ativo = :flAtivo', { flAtivo: 1 })
  // Condição dinâmica baseada no tipo
  .orderBy('E.nm_Fantasia', 'ASC');
```

### Características mantidas

#### CarregarDadosUsuarioValidacao
- Mesmos JOINs (INNER JOIN entre as 4 tabelas: Login, Usuario, Cliente, Empresa)
- Mesmas condições WHERE (fl_Excluido, fl_Ativo)
- Lógica condicional do parâmetro `tipo` (1 = nome usuário, 2 = email)
- Mesmo ORDER BY (nm_Fantasia ASC)
- Mesmos campos selecionados no SELECT

#### ValidaLogin
- Mesmos JOINs (INNER JOIN entre Login e Usuario)
- Mesma condição WHERE (fl_Excluido = 'N')
- Lógica condicional do parâmetro `tipo` (1 = nome usuário, 2 = email)
- Retorna objeto único ou null (equivalente ao comportamento do C#)
- Mesmos campos selecionados no SELECT

#### CarregarDadosUsuario
- Mesmos JOINs (10 tabelas: Usuario, Login, UsuarioControle, UsuarioXPermissao, Cargo, Departamento, PermissaoUsuarioXSubGrupo, GrupoAcessoUsuario, Cliente, Empresa, AcessoUsuario)
- Mesma condição WHERE (U.Id_Usuario = @usuario)
- Mesmo GROUP BY (todos os campos selecionados)
- Retorna objeto único ou null (equivalente ao comportamento do C#)
- Mesmos campos selecionados no SELECT (47 campos)
- Conversão correta de tipos bit para boolean
- Tratamento de campos nullable (nu_Erro_Senha, id_Projeto, ds_IP)

#### AtualizaErroSenha
- Mesma lógica condicional (se erro == true, incrementa; se false, zera)
- Mesma condição WHERE (Id_Usuario = @usuario)
- Retorna boolean (true se sucesso, false se erro)
- Tratamento de erros com try/catch
- Usa QueryBuilder para UPDATE com incremento condicional

#### VerificaCodigoAutenticacaoUsuarioExiste
- Mesma query COUNT (SELECT COUNT(id_Autenticacao))
- Mesmas condições WHERE (id_Empresa = @empresa AND id_Usuario = @usuario)
- Retorna boolean (true se count > 0, false caso contrário)
- Tratamento de erros com try/catch
- Usa QueryBuilder com getCount() para verificar existência

#### CarregarDadosCodigoAutenticacao
- Mesmos campos selecionados (dt_Modificacao, id_Empresa, id_Usuario, ds_Codigo)
- Mesmas condições WHERE (id_Empresa = @empresa AND id_Usuario = @usuario)
- Retorna objeto único ou null (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch
- Usa QueryBuilder com getRawOne() para buscar um único registro

#### ArmazenaCodigoAutenticacaoUsuario
- Mesma lógica condicional (se atualizar == false, INSERT; se true, UPDATE)
- Mesmos campos inseridos/atualizados (dt_Criacao, dt_Modificacao, id_Empresa, id_Usuario, ds_Codigo)
- Mesmas condições WHERE para UPDATE (id_Empresa = @empresa AND id_Usuario = @usuario)
- Retorna boolean (true se sucesso, false se erro)
- Usa transação com QueryRunner (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch e rollback em caso de falha
- Verifica se pelo menos uma linha foi afetada no UPDATE

#### CarregaParametrosEmail
- Mesmos campos selecionados (10 campos: ds_Email, ds_Smtp, nu_Porta_Smtp, fl_SSL, ds_Nome_Saida, ds_Email_Saida, ds_Email_Resposta, ds_Usuario, ds_Password, ds_Token)
- Sem condições WHERE (retorna o primeiro registro da tabela)
- Retorna objeto único ou null (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch
- Usa QueryBuilder com getRawOne() para buscar um único registro
- Conversão correta de tipo bit para boolean (fl_SSL)

#### VerificaNomeUsuarioExiste
- Mesma query COUNT (SELECT COUNT(L.Id_Login))
- Mesmos JOINs (INNER JOIN entre Login, Usuario e Cliente)
- Mesmas condições WHERE (C.Id_Empresa = @empresa AND L.ds_Usuario = @nomeUsuario)
- Retorna boolean (true se count > 0, false caso contrário)
- Tratamento de erros com try/catch
- Usa QueryBuilder com getCount() para verificar existência
- Parâmetro @usuario não é usado na query, apenas para log de erro (mantido na assinatura para compatibilidade)

#### VerificaSenhaUsadaAnteriormente
- Mesma query COUNT (SELECT COUNT(id_Senha))
- Mesmas condições WHERE (id_Usuario = @usuario AND ds_Password = @senha)
- Retorna boolean (true se count > 0, false caso contrário)
- Tratamento de erros com try/catch
- Usa QueryBuilder com getCount() para verificar existência
- Verifica se a senha já foi usada anteriormente pelo usuário

#### SalvarSenhaUsuario
- Duas operações em transação: UPDATE em `security.tbl_Login` e INSERT em `security.tbl_HistoricoSenha`
- Mesmos campos atualizados (dt_Modificacao, dt_Ultima_Senha, nu_Erro_Senha, ds_Password)
- Campos condicionais (fl_Primeiro_Acesso = 0 se primeiro_acesso == true, ds_Usuario se nome_usuario não for vazio)
- Mesma condição WHERE para UPDATE (Id_Usuario = @usuario)
- Retorna boolean (true se sucesso, false se erro)
- Usa transação com QueryRunner (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch e rollback em caso de falha
- Verifica se pelo menos uma linha foi afetada no UPDATE
- Registra a senha no histórico após atualizar

#### RegistroLogAcessoCelular
- Mesma operação INSERT (INSERT INTO Logapp.tbl_AcessoUsuarioCelular)
- Mesmos campos inseridos (dt_Data, Id_Usuario, ds_IP, ds_Info, Id_Cliente)
- Mesmos valores inseridos (@data, @usuario, @ip, @info, @cliente)
- Retorna boolean (true se sucesso, false se erro)
- Usa transação com QueryRunner (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch e rollback em caso de falha
- Registra log de acesso via dispositivo celular

#### RegistroLogAcessoUsuario
- Mesma operação INSERT (INSERT INTO Logapp.tbl_AcessoUsuario)
- Mesmos campos inseridos (dt_Data, Id_Usuario, ds_IP, Id_Cliente)
- Mesmos valores inseridos (@data, @usuario, @ip, @cliente)
- Retorna boolean (true se sucesso, false se erro)
- Usa transação com QueryRunner (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch e rollback em caso de falha
- Registra log de acesso do usuário (sem campo ds_Info, diferente do AcessoUsuarioCelular)

#### VerificaQuantidadeLogoutIncorreto
- Mesma query COUNT (SELECT COUNT(id_Acesso))
- Mesmas condições WHERE (id_Usuario = @usuario AND fl_Logout = 0 AND fl_Bloqueado = 1)
- Retorna number (count se > 0, senão 0)
- Tratamento de erros com try/catch
- Usa QueryBuilder com getCount() para contar registros
- Parâmetro @cliente não é usado na query, apenas para log de erro (mantido na assinatura para compatibilidade)
- Verifica quantidade de acessos com logout incorreto (fl_Logout = 0 e fl_Bloqueado = 1)

#### BloqueioHorarioInvalidoUsuario
- Mesma operação UPDATE (UPDATE security.tbl_UsuarioAcesso SET fl_Bloqueado = 1)
- Mesmas condições WHERE (id_Usuario = @usuario AND fl_Logout = 0 AND dt_Logout IS NULL)
- Retorna boolean (true se sucesso, false se erro)
- Usa transação com QueryRunner (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch e rollback em caso de falha
- Bloqueia acessos com horário inválido (sem logout e sem data de logout)
- Parâmetro @cliente não é usado na query, apenas para log de erro (mantido na assinatura para compatibilidade)

#### CarregarPausas
- Mesmos campos selecionados (id_Empresa, id_Pausa, ds_Pausa)
- Mesmas condições WHERE (id_Empresa = @empresa AND fl_Excluiu = 'N' AND fl_Ativo = 1)
- Mesma ordenação (ORDER BY ds_Pausa ASC)
- Retorna array de PausaDto (equivalente ao List<AccountModel.Pausa> do C#)
- Tratamento de erros com try/catch
- Usa QueryBuilder com getRawMany() para buscar múltiplos registros
- Em caso de erro, retorna array vazio (equivalente ao comportamento do C#)
- Parâmetros @usuario e @cliente não são usados na query, apenas para log de erro (mantidos na assinatura para compatibilidade)

#### RegistraLogControleHorario
- Mesma operação INSERT (INSERT INTO security.tbl_UsuarioAcesso)
- Mesmos campos inseridos (tp_Acesso, id_Usuario, id_Projeto, tp_Login, dt_Login)
- Mesma lógica condicional (se acesso != 3, insere valor; senão insere null)
- Mesmos valores fixos (tp_Login = 1)
- Retorna number (ID do registro inserido ou 0 em caso de erro)
- Usa transação com QueryRunner (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch e rollback em caso de falha
- Retorna o ID gerado usando save() que automaticamente retorna a entidade com ID (equivalente ao SCOPE_IDENTITY() do C#)
- Parâmetro @cliente não é usado na query, apenas para log de erro (mantido na assinatura para compatibilidade)

#### CarregarListaClientesMenu
- Mesmos campos selecionados (M.Id_Cliente, C.nm_Fantasia, M.Id_Usuario)
- Mesmos JOINs (INNER JOIN entre UsuarioMultiAcesso e Cliente)
- Mesmas condições WHERE (M.Id_Usuario = @usuario AND C.fl_Excluido = 'N' AND C.fl_Filial = 0 AND C.Id_Cliente <> @matriz)
- Mesma ordenação (ORDER BY C.nm_Fantasia ASC)
- Retorna array de ClienteMenuDto (equivalente ao List<AccountModel.Cliente> do C#)
- Tratamento de erros com try/catch
- Usa QueryBuilder com getRawMany() para buscar múltiplos registros
- Em caso de erro, retorna array vazio (equivalente ao comportamento do C#)
- Retorna apenas id_Cliente e nm_Fantasia (mesmo que a query selecione Id_Usuario, ele não é usado no modelo C#)

#### CarregarModulos
- Mesmos campos selecionados (A.Id_Usuario, G.Id_Modulo, M.ds_Modulo, M.ic_Modulo)
- Mesmos JOINs (INNER JOIN entre PermissaoUsuarioXSubGrupo, SubGrupo, Grupo, Modulo, ModuloXCliente e GrupoAcessoUsuario)
- Subquery para filtrar módulos do cliente (SELECT Id_Modulo FROM global.tbl_ModuloXCliente WHERE Id_Cliente = @cliente)
- Mesmas condições WHERE (A.Id_Usuario = @usuario AND M.fl_Excluiu = 'N' AND G.fl_Excluiu = 'N' AND S.fl_Excluiu = 'N')
- Mesma agregação (GROUP BY A.Id_Usuario, G.Id_Modulo, M.ds_Modulo, M.ic_Modulo)
- Mesma ordenação (ORDER BY M.ds_Modulo ASC)
- Retorna array de MenuDto (equivalente ao List<AccountModel.Menu> do C#)
- Tratamento de erros com try/catch
- Usa QueryBuilder com subquery e getRawMany() para buscar múltiplos registros
- Em caso de erro, retorna array vazio (equivalente ao comportamento do C#)
- Query complexa com múltiplos JOINs e subquery aninhada

#### CarregarGrupos
- Mesmos campos selecionados (A.Id_Usuario, G.Id_Modulo, S.Id_Grupo, G.ds_Grupo, G.ic_Grupo)
- Mesmos JOINs (INNER JOIN entre PermissaoUsuarioXSubGrupo, SubGrupo, Grupo, Modulo e GrupoAcessoUsuario)
- Condição adicional WHERE (G.Id_Modulo = @modulo) para filtrar por módulo específico
- Mesmas condições WHERE (A.Id_Usuario = @usuario AND M.fl_Excluiu = 'N' AND G.fl_Excluiu = 'N' AND S.fl_Excluiu = 'N')
- Mesma agregação (GROUP BY A.Id_Usuario, G.Id_Modulo, S.Id_Grupo, G.ds_Grupo, G.ic_Grupo)
- Mesma ordenação (ORDER BY G.ds_Grupo ASC)
- Retorna array de MenuDto (equivalente ao List<AccountModel.Menu> do C#)
- Tratamento de erros com try/catch
- Usa QueryBuilder com getRawMany() para buscar múltiplos registros
- Em caso de erro, retorna array vazio (equivalente ao comportamento do C#)
- Query similar a CarregarModulos, mas sem subquery e com filtro por módulo

#### CarregarSubGrupos
- Mesmos campos selecionados (A.Id_Usuario, S.Id_Grupo, A.Id_SubGrupo, S.ds_SubGrupo, S.ds_Pasta, S.ds_View, A.Id_GrupoAcessoUsuario)
- Mesmos JOINs (INNER JOIN entre PermissaoUsuarioXSubGrupo, SubGrupo, Grupo, Modulo e GrupoAcessoUsuario)
- Condição adicional WHERE (S.Id_Grupo = @grupo) para filtrar por grupo específico
- Mesmas condições WHERE (A.Id_Usuario = @usuario AND M.fl_Excluiu = 'N' AND S.fl_Excluiu = 'N')
- Não usa GROUP BY (diferente de CarregarModulos e CarregarGrupos)
- Mesma ordenação (ORDER BY S.ds_SubGrupo ASC)
- Retorna array de MenuDto (equivalente ao List<AccountModel.Menu> do C#)
- Tratamento de erros com try/catch
- Usa QueryBuilder com getRawMany() para buscar múltiplos registros
- Em caso de erro, retorna array vazio (equivalente ao comportamento do C#)
- Query similar a CarregarGrupos, mas sem GROUP BY e com filtro por grupo

#### CarregaPermissoes
- Mesmos campos selecionados (Id_GrupoAcessoUsuario, ds_GrupoAcessoUsuario, fl_Incluir, fl_Alterar, fl_Excluir, fl_Pesquisar)
- Mesma condição WHERE (Id_GrupoAcessoUsuario = @acesso)
- Retorna apenas os campos de permissão (fl_Incluir, fl_Alterar, fl_Excluir, fl_Pesquisar) no DTO
- Retorna PermissaoDto ou null se não encontrado (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch
- Usa Repository.findOne() para buscar um único registro
- Em caso de erro, retorna null (equivalente ao comportamento do C#)
- Query simples sem JOINs
- Parâmetros @usuario e @cliente não são usados na query, apenas para log de erro (mantidos na assinatura para compatibilidade)
- Conversão de boolean (bit) do SQL Server para boolean do TypeScript

#### CarregarDadosCliente
- Mesmos campos selecionados (Id_Cliente, nm_Fantasia, Id_Matriz, fl_Filial, fl_Mascarar_Campos_Lgpd, fl_Higienizacao_Lead, fl_Sobre_Lead)
- Mesma condição WHERE (Id_Cliente = @cliente)
- Retorna ClienteDto ou null se não encontrado (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch
- Usa Repository.findOne() para buscar um único registro
- Em caso de erro, retorna null (equivalente ao comportamento do C#)
- Query simples sem JOINs
- Parâmetro @usuario não é usado na query, apenas para log de erro (mantido na assinatura para compatibilidade)
- Conversão de boolean (bit) do SQL Server para boolean do TypeScript

#### UpdateClienteLogAcessoUsuario
- Mesma operação UPDATE (UPDATE Logapp.tbl_AcessoUsuario)
- Mesmo campo atualizado (Id_Cliente = @cliente)
- Mesma condição WHERE (Id_Usuario = @usuario)
- Retorna boolean (true se sucesso, false se erro)
- Usa transação com QueryRunner (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch e rollback em caso de falha
- Retorna true se pelo menos uma linha foi afetada (equivalente ao comportamento do C#)
- Query simples de UPDATE sem JOINs

#### ExcluirLogAcessoUsuario
- Mesma operação DELETE (DELETE FROM Logapp.tbl_AcessoUsuario)
- Mesma condição WHERE (Id_Usuario = @usuario)
- Retorna boolean (true se sucesso, false se erro)
- Usa transação com QueryRunner (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch e rollback em caso de falha
- Retorna true se a operação foi executada (equivalente ao comportamento do C#)
- Query simples de DELETE sem JOINs
- Parâmetro @cliente não é usado na query, apenas para log de erro (mantido na assinatura para compatibilidade)

#### RegistarLogoutControleHorario
- Mesma operação UPDATE (UPDATE security.tbl_UsuarioAcesso)
- Mesmos campos atualizados (fl_Logout = 1, dt_Logout = @data, tp_Acesso = @tipoAcesso)
- Mesma condição WHERE (id_Acesso = @acesso)
- Retorna boolean (true se sucesso, false se erro)
- Usa transação com QueryRunner (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch e rollback em caso de falha
- Retorna true se pelo menos uma linha foi afetada (equivalente ao comportamento do C#)
- Query simples de UPDATE sem JOINs
- Parâmetros @usuario e @cliente não são usados na query, apenas para log de erro (mantidos na assinatura para compatibilidade)
- Usa data atual do sistema (new Date()) equivalente ao cmdGlobal.DataHoraAtual() do C#

#### RegistrarIntervaloControleHorario
- Duas operações em uma transação: UPDATE (logout) e INSERT (intervalo)
- Mesma operação UPDATE (UPDATE security.tbl_UsuarioAcesso para logout)
- Mesma operação INSERT (INSERT INTO security.tbl_UsuarioAcesso para intervalo)
- Mesmos campos inseridos (tp_Acesso, id_Usuario, id_Projeto, tp_Login = 2, dt_Login)
- Retorna IntervaloControleHorarioDto com sucesso, registro (ID inserido) e horario (equivalente aos parâmetros out do C#)
- Usa transação com QueryRunner (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch e rollback em caso de falha
- Retorna o ID gerado usando save() que automaticamente retorna a entidade com ID (equivalente ao SCOPE_IDENTITY() do C#)
- Parâmetro @cliente não é usado na query, apenas para log de erro (mantido na assinatura para compatibilidade)
- Usa data atual do sistema (new Date()) equivalente ao cmdGlobal.DataHoraAtual() do C#
- tp_Login = 2 indica que é um intervalo (diferente de tp_Login = 1 que é login normal)

#### RegistrarSaidaIntervaloControleHorario
- Duas operações em uma transação: UPDATE (saída do intervalo) e INSERT (login)
- Mesma operação UPDATE (UPDATE security.tbl_UsuarioAcesso para saída do intervalo)
- Mesma operação INSERT (INSERT INTO security.tbl_UsuarioAcesso para login)
- Mesmos campos inseridos (tp_Acesso, id_Usuario, id_Projeto, tp_Login = 1, dt_Login)
- Lógica condicional: se tipo > 0, insere o valor de tp_Acesso; senão insere null (equivalente ao DBNull.Value do C#)
- Retorna SaidaIntervaloControleHorarioDto com sucesso e registro (ID inserido) (equivalente ao parâmetro out do C#)
- Usa transação com QueryRunner (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch e rollback em caso de falha
- Retorna o ID gerado usando save() que automaticamente retorna a entidade com ID (equivalente ao SCOPE_IDENTITY() do C#)
- Parâmetro @cliente não é usado na query, apenas para log de erro (mantido na assinatura para compatibilidade)
- Usa data atual do sistema (new Date()) equivalente ao cmdGlobal.DataHoraAtual() do C#
- tp_Login = 1 indica que é um login normal (diferente de tp_Login = 2 que é intervalo)
- UPDATE não atualiza tp_Acesso (apenas fl_Logout e dt_Logout), diferente do RegistarLogoutControleHorario

#### RegistrarPausaControleHorario
- Duas operações em uma transação: UPDATE (logout) e INSERT (pausa)
- Mesma operação UPDATE (UPDATE security.tbl_UsuarioAcesso para logout, incluindo tp_Acesso)
- Mesma operação INSERT (INSERT INTO security.tbl_UsuarioAcesso para pausa)
- Mesmos campos inseridos (tp_Acesso, id_Usuario, id_Projeto, tp_Login = 3, id_Pausa, dt_Login)
- Retorna PausaControleHorarioDto com sucesso, registro (ID inserido) e horario (equivalente aos parâmetros out do C#)
- Usa transação com QueryRunner (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch e rollback em caso de falha
- Retorna o ID gerado usando save() que automaticamente retorna a entidade com ID (equivalente ao SCOPE_IDENTITY() do C#)
- Parâmetro @cliente não é usado na query, apenas para log de erro (mantido na assinatura para compatibilidade)
- Usa data atual do sistema (new Date()) equivalente ao cmdGlobal.DataHoraAtual() do C#
- tp_Login = 3 indica que é uma pausa (diferente de tp_Login = 1 que é login normal e tp_Login = 2 que é intervalo)
- Inclui id_Pausa no INSERT (campo específico para pausas)
- UPDATE inclui tp_Acesso (similar ao RegistarLogoutControleHorario, diferente do RegistrarSaidaIntervaloControleHorario)

#### RegistrarSaidaPausaControleHorario
- Duas operações em uma transação: UPDATE (saída da pausa) e INSERT (login)
- Mesma operação UPDATE (UPDATE security.tbl_UsuarioAcesso para saída da pausa - apenas fl_Logout e dt_Logout)
- Mesma operação INSERT (INSERT INTO security.tbl_UsuarioAcesso para login)
- Mesmos campos inseridos (tp_Acesso, id_Usuario, id_Projeto, tp_Login = 1, dt_Login)
- Lógica condicional: se tipo > 0, insere o valor de tp_Acesso; senão insere null (equivalente ao DBNull.Value do C#)
- Retorna SaidaIntervaloControleHorarioDto com sucesso e registro (ID inserido) (equivalente ao parâmetro out do C#)
- Reutiliza o DTO SaidaIntervaloControleHorarioDto por ter a mesma estrutura (sucesso e registro)
- Usa transação com QueryRunner (equivalente ao comportamento do C#)
- Tratamento de erros com try/catch e rollback em caso de falha
- Retorna o ID gerado usando save() que automaticamente retorna a entidade com ID (equivalente ao SCOPE_IDENTITY() do C#)
- Parâmetro @cliente não é usado na query, apenas para log de erro (mantido na assinatura para compatibilidade)
- Usa data atual do sistema (new Date()) equivalente ao cmdGlobal.DataHoraAtual() do C#
- tp_Login = 1 indica que é um login normal (diferente de tp_Login = 2 que é intervalo e tp_Login = 3 que é pausa)
- UPDATE não atualiza tp_Acesso (apenas fl_Logout e dt_Logout), similar ao RegistrarSaidaIntervaloControleHorario

### Próximos passos

1. Ajustar os tipos de dados nas entidades conforme seu banco
2. Configurar a connection string do TypeORM no `app.module.ts`
3. Testar a query e validar os resultados

Os arquivos estão em `typeorm-example/` e podem ser adaptados ao seu projeto NestJS.

