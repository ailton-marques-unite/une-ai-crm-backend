/**
 * DTO para o retorno do método ValidaLogin
 * Equivalente ao AccountModel.Login do C#
 */
export class LoginDto {
  id_Usuario: number;
  ds_Password: string;
  id_Cliente: number;
  ds_Email: string;
}

