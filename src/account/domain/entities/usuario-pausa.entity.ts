import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from './empresa.entity';

@Entity({ schema: 'security', name: 'tbl_UsuarioPausa' })
export class UsuarioPausa {
  @PrimaryGeneratedColumn({ name: 'id_Pausa' })
  idPausa: number;

  @Column({ name: 'id_Empresa' })
  idEmpresa: number;

  @Column({ name: 'ds_Pausa', type: 'varchar', length: 255, nullable: true })
  dsPausa: string;

  @Column({ name: 'fl_Excluiu', type: 'char', length: 1, default: 'N' })
  flExcluiu: string;

  @Column({ name: 'fl_Ativo', type: 'bit', default: 1 })
  flAtivo: boolean;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_Empresa' })
  empresa: Empresa;
}

