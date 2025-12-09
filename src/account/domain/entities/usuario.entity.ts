import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Login } from './login.entity';
import { Cliente } from './cliente.entity';
import { Cargo } from './cargo.entity';
import { Departamento } from './departamento.entity';

@Entity({ schema: 'security', name: 'tbl_Usuario' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'Id_Usuario' })
  idUsuario: number;

  @Column({ name: 'Id_Cliente' })
  idCliente: number;

  @Column({ name: 'Id_Cargo', nullable: true })
  idCargo: number;

  @Column({ name: 'Id_Departamento', nullable: true })
  idDepartamento: number;

  @Column({ name: 'nm_Usuario', type: 'varchar', length: 255, nullable: true })
  nmUsuario: string;

  @Column({ name: 'fl_Excluido', type: 'char', length: 1, default: 'N' })
  flExcluido: string;

  @Column({ name: 'fl_Adm', type: 'bit', default: 0 })
  flAdm: boolean;

  @Column({ name: 'fl_MultiAcesso', type: 'bit', default: 0 })
  flMultiAcesso: boolean;

  @Column({ name: 'st_Usuario', type: 'smallint', nullable: true })
  stUsuario: number;

  @Column({ name: 'hs_AcessoInicial', type: 'time', nullable: true })
  hsAcessoInicial: string;

  @Column({ name: 'hs_AcessoFinal', type: 'time', nullable: true })
  hsAcessoFinal: string;

  @Column({ name: 'tp_Acesso', type: 'int', nullable: true })
  tpAcesso: number;

  @Column({ name: 'tp_Funil', type: 'int', nullable: true })
  tpFunil: number;

  @Column({ name: 'ds_Funil', type: 'varchar', length: 255, nullable: true })
  dsFunil: string;

  @OneToOne(() => Login, (login) => login.usuario)
  login: Login;

  @ManyToOne(() => Cliente, (cliente) => cliente.usuarios)
  @JoinColumn({ name: 'Id_Cliente' })
  cliente: Cliente;

  @ManyToOne(() => Cargo)
  @JoinColumn({ name: 'Id_Cargo' })
  cargo: Cargo;

  @ManyToOne(() => Departamento)
  @JoinColumn({ name: 'Id_Departamento' })
  departamento: Departamento;
}

