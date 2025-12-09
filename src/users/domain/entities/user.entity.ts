import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: 'The unique identifier of the user',
        example: 1,
        type: 'integer',
        required: false
    })
    id: number;

    @Column()
    @ApiProperty({
        description: 'The full name of the user',
        example: 'John Doe',
        type: 'string',
        required: true
    })
    name: string;

    @Column()
    @ApiProperty({
        description: 'The email address of the user',
        example: 'john.doe@example.com',
        type: 'string',
        format: 'email',
        required: true
    })
    email: string;
}