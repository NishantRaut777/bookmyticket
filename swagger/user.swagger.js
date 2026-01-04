/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and trip search APIs
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: authToken
 */

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       401:
 *         description: Unauthorized (token missing or invalid)
 */

/**
 * @swagger
 * /api/user/getTrips:
 *   get:
 *     summary: Get latest bus and train trips
 *     description: Fetches the latest 20 bus trips and 20 train trips sorted by departure time.
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Trips fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 busTrips:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 65a1234abcde123456789012
 *                       origin:
 *                         type: string
 *                         example: Pune
 *                       destination:
 *                         type: string
 *                         example: Mumbai
 *                       departureTime:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-01-05T06:30:00.000Z
 *                 trainTrips:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 65b9876abcde987654321098
 *                       origin:
 *                         type: string
 *                         example: Pune
 *                       destination:
 *                         type: string
 *                         example: Mumbai CST
 *                       departureTime:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-01-05T07:45:00.000Z
 * 
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/search/bus:
 *   get:
 *     summary: Search bus trips
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           example: bus
 *       - in: query
 *         name: origin
 *         required: true
 *         schema:
 *           type: string
 *           example: pune
 *       - in: query
 *         name: destination
 *         required: true
 *         schema:
 *           type: string
 *           example: mumbai
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-12-29
 *       - in: query
 *         name: passengers
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Bus trips fetched successfully
 *       400:
 *         description: Invalid query parameters
 */

/**
 * @swagger
 * /api/user/search/train:
 *   get:
 *     summary: Search train trips
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           example: train
 *       - in: query
 *         name: origin
 *         required: true
 *         schema:
 *           type: string
 *           example: pune
 *       - in: query
 *         name: destination
 *         required: true
 *         schema:
 *           type: string
 *           example: mumbai cst
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-01-05
 *       - in: query
 *         name: passengers
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Train trips fetched successfully
 *       400:
 *         description: Invalid query parameters
 */
