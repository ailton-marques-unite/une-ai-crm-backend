/**
 * DTO para o retorno do método CarregarDadosCliente
 * Equivalente ao AccountModel.Cliente do C#
 */
export class ClienteDto {
  id_Cliente: number;
  nm_Fantasia: string;
  id_Matriz: number;
  fl_Filial: boolean;
  fl_Mascarar_Campos_Lgpd: boolean;
  fl_Higienizacao_Lead: boolean;
  fl_Sobre_Lead: boolean;
}

