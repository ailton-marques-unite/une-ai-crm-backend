import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Cliente } from './cliente.entity';

@Entity({ schema: 'Logapp', name: 'tbl_AcessoUsuarioCelular' })
export class AcessoUsuarioCelular {
  @PrimaryGeneratedColumn({ name: 'id_Acesso' })
  idAcesso: number;

  @Column({ name: 'dt_Data', type: 'datetime' })
  dtData: Date;

  @Column({ name: 'Id_Usuario' })
  idUsuario: number;

  @Column({ name: 'ds_IP', type: 'varchar', length: 255, nullable: true })
  dsIP: string;

  @Column({ name: 'ds_Info', type: 'varchar', length: 255, nullable: true })
  dsInfo: string;

  @Column({ name: 'Id_Cliente' })
  idCliente: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'Id_Usuario' })
  usuario: Usuario;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'Id_Cliente' })
  cliente: Cliente;
}

