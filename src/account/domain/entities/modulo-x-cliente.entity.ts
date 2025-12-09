import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from './cliente.entity';
import { Modulo } from './modulo.entity';

@Entity({ schema: 'global', name: 'tbl_ModuloXCliente' })
export class ModuloXCliente {
  @PrimaryGeneratedColumn({ name: 'Id_ModuloXCliente' })
  idModuloXCliente: number;

  @Column({ name: 'Id_Cliente' })
  idCliente: number;

  @Column({ name: 'Id_Modulo' })
  idModulo: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'Id_Cliente' })
  cliente: Cliente;

  @ManyToOne(() => Modulo)
  @JoinColumn({ name: 'Id_Modulo' })
  modulo: Modulo;
}

