# Expor Endpoints da Account (Domain)

## Objetivo

Expor todos os métodos do serviço AccountService no AccountController utilizando os padrões DDD, camada de DTOs, inversão de dependência (via interface do repository) e boas práticas NestJS.

## Etapas do Plano

1. Mapeamento dos métodos públicos do serviço `AccountService` presentes em `src/account/application/services/account.service.ts`.
2. Criação dos endpoints equivalentes em `src/account/infrastructure/controllers/account.controller.ts`.
3. Uso rigoroso dos DTOs existentes nas pastas de `dtos/` para as entradas/saídas de dados das rotas (conforme README e architecture.md).
4. Garantia de que toda interface de request valida os parâmetros usando validation pipes e, quando necessário, definir novos métodos/contratos na `account.repository.interface.ts`.
5. Aplicação de decorators apropriados do NestJS (`@Get`, `@Post`, etc) no controller e boas práticas REST.
6. (Opcional) Documentação dos endpoints com Swagger (`@ApiOperation`, etc) para facilitar integração.
7. Teste manual de cada rota exposta.

## Mapeamento dos Endpoints (nome = função)

Para cada método público do AccountService, criar endpoint REST correspondente com mesmo nome do método (após o prefixo `/conta/`), verbo apropriado e uso do DTO correto.

| Endpoint                                          | Verbo | Função Service                           |
|---------------------------------------------------|-------|-------------------------------------------|
| /conta/carregarDadosUsuarioValidacao              | POST  | carregarDadosUsuarioValidacao             |
| /conta/carregarDadosUsuarioValidacaoV2            | POST  | carregarDadosUsuarioValidacaoV2           |
| /conta/validaLogin                                | POST  | validaLogin                              |
| /conta/carregarDadosUsuario                       | GET   | carregarDadosUsuario                     |
| /conta/atualizaErroSenha                          | POST  | atualizaErroSenha                        |
| /conta/verificaCodigoAutenticacaoUsuarioExiste    | GET   | verificaCodigoAutenticacaoUsuarioExiste  |
| /conta/carregarDadosCodigoAutenticacao            | GET   | carregarDadosCodigoAutenticacao          |
| /conta/armazenaCodigoAutenticacaoUsuario          | POST  | armazenaCodigoAutenticacaoUsuario        |
| /conta/carregaParametrosEmail                     | GET   | carregaParametrosEmail                   |
| /conta/verificaNomeUsuarioExiste                  | GET   | verificaNomeUsuarioExiste                |
| /conta/verificaSenhaUsadaAnteriormente            | GET   | verificaSenhaUsadaAnteriormente          |
| /conta/salvarSenhaUsuario                         | POST  | salvarSenhaUsuario                       |
| /conta/registroLogAcessoCelular                   | POST  | registroLogAcessoCelular                 |
| /conta/registroLogAcessoUsuario                   | POST  | registroLogAcessoUsuario                 |
| /conta/verificaQuantidadeLogoutIncorreto          | GET   | verificaQuantidadeLogoutIncorreto        |
| /conta/bloqueioHorarioInvalidoUsuario             | POST  | bloqueioHorarioInvalidoUsuario           |
| /conta/carregarPausas                             | GET   | carregarPausas                           |
| /conta/registraLogControleHorario                 | POST  | registraLogControleHorario               |
| /conta/carregarListaClientesMenu                  | GET   | carregarListaClientesMenu                |
| /conta/carregarModulos                            | GET   | carregarModulos                          |
| /conta/carregarGrupos                             | GET   | carregarGrupos                           |
| /conta/carregarSubGrupos                          | GET   | carregarSubGrupos                        |
| /conta/carregaPermissoes                          | GET   | carregaPermissoes                        |
| /conta/carregarDadosCliente                       | GET   | carregarDadosCliente                     |
| /conta/updateClienteLogAcessoUsuario              | POST  | updateClienteLogAcessoUsuario            |
| /conta/excluirLogAcessoUsuario                    | POST  | excluirLogAcessoUsuario                  |
| /conta/registarLogoutControleHorario              | POST  | registarLogoutControleHorario            |
| /conta/registrarIntervaloControleHorario          | POST  | registrarIntervaloControleHorario        |
| /conta/registrarSaidaIntervaloControleHorario     | POST  | registrarSaidaIntervaloControleHorario   |
| /conta/registrarPausaControleHorario              | POST  | registrarPausaControleHorario            |
| /conta/registrarSaidaPausaControleHorario         | POST  | registrarSaidaPausaControleHorario       |

- Entrada e saída tipadas via DTOs por método.
- Decorre do Domain Service. Não há lógica de negócio no controller.
- Parâmetros e body devem bater com os DTOs de cada função.

## Observação

- O controller NÃO deve implementar lógica de negócio. Toda regra permanece no service.
- As interfaces dos repositórios podem ser usadas para extensão futura (validações customizadas, contratos, etc), reforçando inversão de dependência e testabilidade.