import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Grupo } from './grupo.entity';

@Entity('global.tbl_SubGrupo')
export class SubGrupo {
  @PrimaryGeneratedColumn({ name: 'Id_SubGrupo' })
  idSubGrupo: number;

  @Column({ name: 'Id_Grupo' })
  idGrupo: number;

  @Column({ name: 'ds_SubGrupo', type: 'varchar', length: 255, nullable: true })
  dsSubGrupo: string;

  @Column({ name: 'ds_Pasta', type: 'varchar', length: 255, nullable: true })
  dsPasta: string;

  @Column({ name: 'ds_View', type: 'varchar', length: 255, nullable: true })
  dsView: string;

  @Column({ name: 'fl_Excluiu', type: 'char', length: 1, default: 'N' })
  flExcluiu: string;

  @ManyToOne(() => Grupo)
  @JoinColumn({ name: 'Id_Grupo' })
  grupo: Grupo;
}

