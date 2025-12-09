/**
 * DTO para o retorno dos métodos CarregarModulos, CarregarGrupos e CarregarSubGrupos
 * Equivalente ao AccountModel.Menu do C#
 */
export class MenuDto {
  id_Usuario: number;
  id_Modulo?: number;
  id_Grupo?: number;
  id_SubGrupo?: number;
  ds_Modulo?: string;
  ds_Grupo?: string;
  ds_SubGrupo?: string;
  ic_Modulo?: string;
  ic_Grupo?: string;
  ds_Pasta?: string;
  ds_View?: string;
  id_GrupoAcessoUsuario?: number;
}

