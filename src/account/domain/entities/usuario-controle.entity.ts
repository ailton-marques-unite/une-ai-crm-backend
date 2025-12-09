import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('security.tbl_UsuarioControle')
export class UsuarioControle {
  @PrimaryGeneratedColumn({ name: 'id_UsuarioControle' })
  idUsuarioControle: number;

  @Column({ name: 'id_Usuario' })
  idUsuario: number;

  @Column({ name: 'id_Projeto', type: 'int', nullable: true })
  idProjeto: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_Usuario' })
  usuario: Usuario;
}

