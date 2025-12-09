import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity({ schema: 'security', name: 'tbl_UsuarioAcesso' })
export class UsuarioAcesso {
  @PrimaryGeneratedColumn({ name: 'id_Acesso' })
  idAcesso: number;

  @Column({ name: 'id_Usuario' })
  idUsuario: number;

  @Column({ name: 'tp_Acesso', type: 'int', nullable: true })
  tpAcesso: number;

  @Column({ name: 'id_Projeto', type: 'int', nullable: true })
  idProjeto: number;

  @Column({ name: 'tp_Login', type: 'int', nullable: true })
  tpLogin: number;

  @Column({ name: 'dt_Login', type: 'datetime', nullable: true })
  dtLogin: Date;

  @Column({ name: 'dt_Logout', type: 'datetime', nullable: true })
  dtLogout: Date;

  @Column({ name: 'fl_Logout', type: 'bit', default: 0 })
  flLogout: boolean;

  @Column({ name: 'fl_Bloqueado', type: 'bit', default: 0 })
  flBloqueado: boolean;

  @Column({ name: 'id_Pausa', type: 'int', nullable: true })
  idPausa: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_Usuario' })
  usuario: Usuario;
}

