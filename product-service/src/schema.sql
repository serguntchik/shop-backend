create table products (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    price integer not null
)

create table stocks (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid unique,
    count integer not null,
    foreign key ("product_id") references "products" ("id")
)
