import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity('global.tbl_Empresa')
export class Empresa {
  @PrimaryGeneratedColumn({ name: 'Id_Empresa' })
  idEmpresa: number;

  @Column({ name: 'nm_Fantasia', type: 'varchar', length: 255, nullable: true })
  nmFantasia: string;

  @Column({ name: 'fl_Excluido', type: 'bit', default: 0 })
  flExcluido: number;

  @Column({ name: 'fl_Ativo', type: 'bit', default: 1 })
  flAtivo: number;

  @Column({ name: 'nu_DDI', type: 'int', nullable: true })
  nuDDI: number;

  @OneToMany(() => Cliente, (cliente) => cliente.empresa)
  clientes: Cliente[];
}

