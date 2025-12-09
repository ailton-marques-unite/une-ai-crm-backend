import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('global.tbl_Departamento')
export class Departamento {
  @PrimaryGeneratedColumn({ name: 'Id_Departamento' })
  idDepartamento: number;

  @Column({ name: 'ds_Departamento', type: 'varchar', length: 255, nullable: true })
  dsDepartamento: string;
}

