import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('security.tbl_GrupoAcessoUsuario')
export class GrupoAcessoUsuario {
  @PrimaryGeneratedColumn({ name: 'Id_GrupoAcessoUsuario' })
  idGrupoAcessoUsuario: number;

  @Column({ name: 'ds_GrupoAcessoUsuario', type: 'varchar', length: 255, nullable: true })
  dsGrupoAcessoUsuario: string;

  @Column({ name: 'fl_Incluir', type: 'bit', default: 0 })
  flIncluir: boolean;

  @Column({ name: 'fl_Alterar', type: 'bit', default: 0 })
  flAlterar: boolean;

  @Column({ name: 'fl_Excluir', type: 'bit', default: 0 })
  flExcluir: boolean;

  @Column({ name: 'fl_Pesquisar', type: 'bit', default: 0 })
  flPesquisar: boolean;

  @Column({ name: 'id_ordem', type: 'int', nullable: true })
  idOrdem: number;
}

