import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Empresa } from './empresa.entity';

@Entity({ schema: 'security', name: 'tbl_UsuarioAutenticacao' })
export class UsuarioAutenticacao {
  @PrimaryGeneratedColumn({ name: 'id_Autenticacao' })
  idAutenticacao: number;

  @Column({ name: 'id_Empresa' })
  idEmpresa: number;

  @Column({ name: 'id_Usuario' })
  idUsuario: number;

  @Column({ name: 'ds_Codigo', type: 'varchar', length: 255, nullable: true })
  dsCodigo: string;

  @Column({ name: 'dt_Criacao', type: 'datetime', nullable: true })
  dtCriacao: Date;

  @Column({ name: 'dt_Modificacao', type: 'datetime', nullable: true })
  dtModificacao: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_Usuario' })
  usuario: Usuario;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_Empresa' })
  empresa: Empresa;
}

