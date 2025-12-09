import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity({ schema: 'security', name: 'tbl_HistoricoSenha' })
export class HistoricoSenha {
  @PrimaryGeneratedColumn({ name: 'id_Senha' })
  idSenha: number;

  @Column({ name: 'id_Usuario' })
  idUsuario: number;

  @Column({ name: 'ds_Password', type: 'varchar', length: 255, nullable: true })
  dsPassword: string;

  @Column({ name: 'dt_Criacao', type: 'datetime', nullable: true })
  dtCriacao: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_Usuario' })
  usuario: Usuario;
}

