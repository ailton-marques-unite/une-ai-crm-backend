import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Empresa } from './empresa.entity';
import { Usuario } from './usuario.entity';

@Entity({ schema: 'global', name: 'tbl_Cliente' })
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'Id_Cliente' })
  idCliente: number;

  @Column({ name: 'Id_Empresa' })
  idEmpresa: number;

  @Column({ name: 'Id_Matriz', nullable: true })
  idMatriz: number;

  @Column({ name: 'nm_Fantasia', type: 'varchar', length: 255, nullable: true })
  nmFantasia: string;

  @Column({ name: 'fl_Excluido', type: 'char', length: 1, default: 'N' })
  flExcluido: string;

  @Column({ name: 'fl_Filial', type: 'bit', default: 0 })
  flFilial: boolean;

  @Column({ name: 'fl_MultiAcesso', type: 'bit', default: 0 })
  flMultiAcesso: boolean;

  @Column({ name: 'fl_Mascarar_Campos_Lgpd', type: 'bit', default: 0 })
  flMascararCamposLgpd: boolean;

  @Column({ name: 'fl_Higienizacao_Lead', type: 'bit', default: 0 })
  flHigienizacaoLead: boolean;

  @Column({ name: 'fl_Sobre_Lead', type: 'bit', default: 0 })
  flSobreLead: boolean;

  @ManyToOne(() => Empresa, (empresa) => empresa.clientes)
  @JoinColumn({ name: 'Id_Empresa' })
  empresa: Empresa;

  @OneToMany(() => Usuario, (usuario) => usuario.cliente)
  usuarios: Usuario[];
}

