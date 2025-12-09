import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Cliente } from './cliente.entity';

@Entity({ schema: 'Logapp', name: 'tbl_AcessoUsuario' })
export class AcessoUsuario {
  @PrimaryGeneratedColumn({ name: 'Id_AcessoUsuario' })
  idAcessoUsuario: number;

  @Column({ name: 'dt_Data', type: 'datetime', nullable: true })
  dtData: Date;

  @Column({ name: 'Id_Usuario' })
  idUsuario: number;

  @Column({ name: 'ds_IP', type: 'varchar', length: 50, nullable: true })
  dsIP: string;

  @Column({ name: 'Id_Cliente', nullable: true })
  idCliente: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'Id_Usuario' })
  usuario: Usuario;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'Id_Cliente' })
  cliente: Cliente;
}

