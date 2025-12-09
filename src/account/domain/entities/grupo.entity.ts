import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Modulo } from './modulo.entity';

@Entity('global.tbl_Grupo')
export class Grupo {
  @PrimaryGeneratedColumn({ name: 'Id_Grupo' })
  idGrupo: number;

  @Column({ name: 'Id_Modulo' })
  idModulo: number;

  @Column({ name: 'ds_Grupo', type: 'varchar', length: 255, nullable: true })
  dsGrupo: string;

  @Column({ name: 'ic_Grupo', type: 'varchar', length: 255, nullable: true })
  icGrupo: string;

  @Column({ name: 'fl_Excluiu', type: 'char', length: 1, default: 'N' })
  flExcluiu: string;

  @ManyToOne(() => Modulo)
  @JoinColumn({ name: 'Id_Modulo' })
  modulo: Modulo;
}

