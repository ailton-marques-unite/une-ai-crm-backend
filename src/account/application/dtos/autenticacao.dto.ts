/**
 * DTO para o retorno do método CarregarDadosCodigoAutenticacao
 * Equivalente ao AccountModel.Autenticacao do C#
 */
export class AutenticacaoDto {
  dt_Modificacao: Date;
  id_Empresa: number;
  id_Usuario: number;
  ds_Codigo: string;
}

