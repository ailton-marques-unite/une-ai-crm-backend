/**
 * DTO para o retorno do método CarregaParametrosEmail
 * Equivalente ao AccountModel.Email do C#
 */
export class EmailDto {
  ds_Email: string;
  ds_Smtp: string;
  nu_Porta_Smtp: number;
  fl_SSL: boolean;
  ds_Nome_Saida: string;
  ds_Email_Saida: string;
  ds_Email_Resposta: string;
  ds_Usuario: string;
  ds_Password: string;
  ds_Token: string;
}

