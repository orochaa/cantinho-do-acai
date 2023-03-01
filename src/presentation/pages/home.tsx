import { Link } from 'react-router-dom'

type Product = {
  id: string
  img: string
  name: string
  people: number
  size: number
  price: number
}

export function HomePage(): JSX.Element {
  const products: Product[] = [
    {
      id: 'kit-para-familia',
      img: '/img/kit-para-familia.jpeg',
      name: 'Kit para Família',
      people: 4,
      price: 45,
      size: 1000
    },
    {
      id: 'marmitex-do-cantinho',
      img: '/img/acai.jpg',
      name: 'Marmitex do Cantinho',
      people: 3,
      price: 30,
      size: 900
    },
    {
      id: 'copo-grande',
      img: '/img/acai.jpg',
      name: 'Copo Grande',
      people: 1,
      price: 26,
      size: 770
    },
    {
      id: 'copo-medio',
      img: '/img/copo-medio.jpeg',
      name: 'Copo Médio',
      people: 1,
      price: 17,
      size: 440
    },
    {
      id: 'copo-pequeno',
      img: '/img/copo-pequeno.jpeg',
      name: 'Copo Pequeno',
      people: 1,
      price: 12,
      size: 250
    }
  ]

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-900 to-purple-500 py-16">
      <img
        src="/img/logo.png"
        alt="logo cantinho do açaí"
        className="mx-auto mb-8 max-h-48 w-11/12 max-w-fit"
      />
      <div className="mx-auto flex w-11/12 flex-col gap-4">
        {products.map(product => (
          <Link
            key={product.id}
            to={product.id}
            className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 rounded bg-white p-4 shadow hover:bg-zinc-100"
          >
            <div className="">
              <h2 className="text-lg font-bold text-black md:text-xl">
                {product.name}
              </h2>
              <p className="text-sm md:text-base">
                Serve até {product.people} pessoa{product.people !== 1 && 's'}.
                (aprox.{product.size}g)
              </p>
              <span className="mt-4 block font-poppins text-base font-semibold md:text-lg">
                R$ {product.price},00
              </span>
            </div>
            <img
              src={product.img}
              alt={`Imagem ${product.name}`}
              className="w-1/3 overflow-hidden bg-cover bg-center"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
