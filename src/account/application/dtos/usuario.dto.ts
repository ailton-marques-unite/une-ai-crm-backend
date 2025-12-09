/**
 * DTO para o retorno do método CarregarDadosUsuario
 * Equivalente ao AccountModel.Usuario do C#
 */
export class UsuarioDto {
  nu_DDI: number;
  id_Empresa: number;
  id_Cliente: number;
  nm_Fantasia: string;
  id_Matriz: number;
  fl_Filial: boolean;
  fl_MultiAcessoCliente: boolean;
  fl_Mascarar_Campos_Lgpd: boolean;
  fl_Higienizacao_Lead: boolean;
  fl_Sobre_Lead: boolean;
  fl_MultiAcesso: boolean;
  id_Usuario: number;
  nm_Usuario: string;
  fl_Adm: boolean;
  ds_Usuario: string;
  ds_Email: string;
  ds_Password: string;
  dt_Ultima_Senha: Date;
  nu_Erro_Senha?: number;
  ds_Departamento: string;
  tp_Cargo: number;
  ds_Cargo: string;
  fl_Excluido: string;
  st_Usuario: number;
  hr_AcessoInicial: string; // TimeSpan no C#
  hr_AcessoFinal: string; // TimeSpan no C#
  ds_IP: string;
  fl_Supervisao: boolean;
  fl_Alterar_Lead: boolean;
  fl_PermitirChat: boolean;
  fl_PermitirRetornoMkt: boolean;
  fl_PermitirReceptivo: boolean;
  fl_PermitirCaptura: boolean;
  fl_PermitirTarefa: boolean;
  fl_LogarSemRamal: boolean;
  fl_ControleHorario: boolean;
  fl_LogoutAutomatico: boolean;
  fl_ExcluirMemoriaAtendimento: boolean;
  fl_VisualizarCamposLgpd: boolean;
  fl_HigienizarLead: boolean;
  fl_GravarAtendimento: boolean;
  fl_PopUpRetorno: boolean;
  id_GrupoAcessoUsuario: number;
  nu_Ordem: number;
  tp_Acesso: number;
  id_Projeto?: number;
  tp_Funil: number;
  ds_Funil: string;
}

