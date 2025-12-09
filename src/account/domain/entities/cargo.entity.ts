import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('global.tbl_Cargo')
export class Cargo {
  @PrimaryGeneratedColumn({ name: 'Id_Cargo' })
  idCargo: number;

  @Column({ name: 'ds_Cargo', type: 'varchar', length: 255, nullable: true })
  dsCargo: string;

  @Column({ name: 'tp_Cargo', type: 'int', nullable: true })
  tpCargo: number;
}

