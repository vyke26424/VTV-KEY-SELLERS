import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên sản phẩm (VD: Spotify Premium)

  @Column()
  description: string; // Mô tả

  @Column('decimal')
  price: number; // Giá bán

  @Column('decimal', { nullable: true })
  oldPrice: number; // Giá cũ (để gạch đi)

  @Column()
  category: string; // Danh mục (VD: entertainment, steam, ai...)

  @Column({ nullable: true })
  image: string; // Đường dẫn ảnh
  
  @Column({ default: true })
  isActive: boolean; // Còn bán hay không
}