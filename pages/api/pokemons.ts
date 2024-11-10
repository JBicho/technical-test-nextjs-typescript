// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import Pokemons from "./data/pokemon.json";
import { Pokemon } from "../../common/interfaces/pokemon";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Pokemon[]>
) {
  res.status(200).json(Pokemons);
}
