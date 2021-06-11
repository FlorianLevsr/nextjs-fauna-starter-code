import { NextApiRequest, NextApiResponse } from 'next'
import { GraphQLClient } from 'graphql-request';


class MethodNotAllowedError extends Error { }

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query, variables } = req.body;

    // Récupère les variables d'environnement
    const {
      NEXT_PUBLIC_FAUNA_GRAPHQL_DOMAIN,
      NEXT_PUBLIC_FAUNA_SECRET
    } = process.env;

    // if (typeof FAUNA_API_ENDPOINT === 'undefined') {
    //   throw new Error('Fauna API endpoint missing in environment variables.');
    // }
    // if (typeof FAUNA_DB_KEY === 'undefined') {
    //   throw new Error('Fauna secret missing in environment variables.');
    // }

    // Vérifie que la requête HTTP est bien en méthode POST
    //if (req.method !== 'POST') {
    //  throw new MethodNotAllowedError(`Cannot ${req.method} /api/fauna`);
    //};

    // Crée un client capable d'envoyer des requêtes GraphQL à Fauna
    const graphQLClient = new GraphQLClient(`${NEXT_PUBLIC_FAUNA_GRAPHQL_DOMAIN}/graphql`, {
      headers: {
        authorization: `Bearer ${NEXT_PUBLIC_FAUNA_SECRET}`,
      },
    })

    // Envoie la requête GraphQL
    const data = await graphQLClient.request(query, variables);

    // Renvoie le résultat de la requête au client
    res.status(200).json(data);

  }
  catch (error) {
    if (error instanceof MethodNotAllowedError) {
      res.status(405).json({ statusCode: 405, message: error.message })
    } else {
      res.status(500).json({ statusCode: 500, message: error.message })
    }
  }

}

export default handler