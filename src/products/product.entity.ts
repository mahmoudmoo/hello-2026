import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
const CURRENT_TIMESTAMP = 'current_timestamp(6)';

@Entity({ name: 'products' })
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 150})
    title: string;

    @Column({type: 'float'})
    price: number;

    @Column()
    description: string;

    @CreateDateColumn({ type: 'timestamp', default:() => CURRENT_TIMESTAMP })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default:() => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;
}