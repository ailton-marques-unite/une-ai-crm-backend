/**
 * DTO para o retorno do método CarregarListaClientesMenu
 * Equivalente ao AccountModel.Cliente do C# (versão simplificada para menu)
 */
export class ClienteMenuDto {
  id_Cliente: number;
  nm_Fantasia: string;
  id_Usuario?: number; // Campo adicional retornado na query, mas não usado no modelo C#
}

