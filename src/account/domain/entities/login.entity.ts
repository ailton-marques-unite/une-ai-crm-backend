import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity({ schema: 'security', name: 'tbl_Login' })
export class Login {
  @PrimaryGeneratedColumn({ name: 'Id_Login' })
  idLogin: number;

  @Column({ name: 'Id_Usuario' })
  idUsuario: number;

  @Column({ name: 'ds_Usuario', type: 'varchar', length: 255, nullable: true })
  dsUsuario: string;

  @Column({ name: 'ds_Email', type: 'varchar', length: 255, nullable: true })
  dsEmail: string;

  @Column({ name: 'ds_Password', type: 'varchar', length: 255, nullable: true })
  dsPassword: string;

  @Column({ name: 'fl_Primeiro_Acesso', type: 'bit', default: true })
  flPrimeiroAcesso: boolean;

  @Column({ name: 'dt_Ultima_Senha', type: 'datetime', nullable: true })
  dtUltimaSenha: Date;

  @Column({ name: 'nu_Erro_Senha', type: 'int', default: 0 })
  nuErroSenha: number;

  @OneToOne(() => Usuario, (usuario) => usuario.login)
  @JoinColumn({ name: 'Id_Usuario' })
  usuario: Usuario;
}

