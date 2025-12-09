import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('security.tbl_UsuarioXPermissao')
export class UsuarioXPermissao {
  @PrimaryGeneratedColumn({ name: 'Id_UsuarioXPermissao' })
  idUsuarioXPermissao: number;

  @Column({ name: 'Id_Usuario' })
  idUsuario: number;

  @Column({ name: 'fl_Supervisao', type: 'bit', default: 0 })
  flSupervisao: boolean;

  @Column({ name: 'fl_Alterar_Lead', type: 'bit', default: 0 })
  flAlterarLead: boolean;

  @Column({ name: 'fl_PermitirCaptura', type: 'bit', default: 0 })
  flPermitirCaptura: boolean;

  @Column({ name: 'fl_PermitirChat', type: 'bit', default: 0 })
  flPermitirChat: boolean;

  @Column({ name: 'fl_PermitirReceptivo', type: 'bit', default: 0 })
  flPermitirReceptivo: boolean;

  @Column({ name: 'fl_PermitirRetornoMkt', type: 'bit', default: 0 })
  flPermitirRetornoMkt: boolean;

  @Column({ name: 'fl_PermitirTarefa', type: 'bit', default: 0 })
  flPermitirTarefa: boolean;

  @Column({ name: 'fl_LogarSemRamal', type: 'bit', default: 0 })
  flLogarSemRamal: boolean;

  @Column({ name: 'fl_ControleHorario', type: 'bit', default: 0 })
  flControleHorario: boolean;

  @Column({ name: 'fl_LogoutAutomatico', type: 'bit', default: 0 })
  flLogoutAutomatico: boolean;

  @Column({ name: 'fl_ExcluirMemoriaAtendimento', type: 'bit', default: 0 })
  flExcluirMemoriaAtendimento: boolean;

  @Column({ name: 'fl_VisualizarCamposLgpd', type: 'bit', default: 0 })
  flVisualizarCamposLgpd: boolean;

  @Column({ name: 'fl_HigienizarLead', type: 'bit', default: 0 })
  flHigienizarLead: boolean;

  @Column({ name: 'fl_UtilizaGravacao', type: 'bit', default: 0 })
  flUtilizaGravacao: boolean;

  @Column({ name: 'fl_PopUpRetorno', type: 'bit', default: 0 })
  flPopUpRetorno: boolean;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'Id_Usuario' })
  usuario: Usuario;
}

