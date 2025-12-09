import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Cliente } from './cliente.entity';

@Entity({ schema: 'security', name: 'tbl_UsuarioMultiAcesso' })
export class UsuarioMultiAcesso {
  @PrimaryGeneratedColumn({ name: 'Id_UsuarioMultiAcesso' })
  idUsuarioMultiAcesso: number;

  @Column({ name: 'Id_Usuario' })
  idUsuario: number;

  @Column({ name: 'Id_Cliente' })
  idCliente: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'Id_Usuario' })
  usuario: Usuario;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'Id_Cliente' })
  cliente: Cliente;
}

