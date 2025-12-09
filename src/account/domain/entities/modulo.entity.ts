import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('global.tbl_Modulo')
export class Modulo {
  @PrimaryGeneratedColumn({ name: 'Id_Modulo' })
  idModulo: number;

  @Column({ name: 'ds_Modulo', type: 'varchar', length: 255, nullable: true })
  dsModulo: string;

  @Column({ name: 'ic_Modulo', type: 'varchar', length: 255, nullable: true })
  icModulo: string;

  @Column({ name: 'fl_Excluiu', type: 'char', length: 1, default: 'N' })
  flExcluiu: string;
}

