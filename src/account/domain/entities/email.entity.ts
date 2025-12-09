import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'admin', name: 'tbl_Email' })
export class Email {
  @PrimaryGeneratedColumn({ name: 'id_Email' })
  idEmail: number;

  @Column({ name: 'ds_Email', type: 'varchar', length: 255, nullable: true })
  dsEmail: string;

  @Column({ name: 'ds_Smtp', type: 'varchar', length: 255, nullable: true })
  dsSmtp: string;

  @Column({ name: 'nu_Porta_Smtp', type: 'int', nullable: true })
  nuPortaSmtp: number;

  @Column({ name: 'fl_SSL', type: 'bit', default: 0 })
  flSSL: boolean;

  @Column({ name: 'ds_Nome_Saida', type: 'varchar', length: 255, nullable: true })
  dsNomeSaida: string;

  @Column({ name: 'ds_Email_Saida', type: 'varchar', length: 255, nullable: true })
  dsEmailSaida: string;

  @Column({ name: 'ds_Email_Resposta', type: 'varchar', length: 255, nullable: true })
  dsEmailResposta: string;

  @Column({ name: 'ds_Usuario', type: 'varchar', length: 255, nullable: true })
  dsUsuario: string;

  @Column({ name: 'ds_Password', type: 'varchar', length: 255, nullable: true })
  dsPassword: string;

  @Column({ name: 'ds_Token', type: 'varchar', length: 255, nullable: true })
  dsToken: string;
}

