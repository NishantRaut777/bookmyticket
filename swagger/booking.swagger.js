/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Ticket booking management APIs
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
 * /api/booking:
 *   get:
 *     summary: Get all bookings for logged-in user
 *     tags: [Booking]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user bookings
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/booking/{id}:
 *   get:
 *     summary: Get specific booking details
 *     tags: [Booking]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 69536960b671a353ddfa94b5
 *     responses:
 *       200:
 *         description: Booking details fetched successfully
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/booking/{type}/vehicle/{vehicleId}:
 *   get:
 *     summary: Get vehicle details (Bus or Train)
 *     tags: [Booking]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [bus, train]
 *         example: bus
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6950d428cdc69048a8eee06a
 *     responses:
 *       200:
 *         description: Vehicle details fetched successfully
 *       400:
 *         description: Invalid vehicle type or ID
 */

/**
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Create a new booking ( If bus is selected then valid values can be A1->A10, B1->B10, C1->C10, D1->D10 so there are total 40 seats for bus. If train is selected then valid values can be A1->A10, B1->B10, C1->C10, D1->D10............ T1->T10 so there will be total 200 seats for train. )
 *     tags: [Booking]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - vehicleId
 *               - selectedSeats
 *               - paymentMethod
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [bus, train]
 *                 example: bus
 *               vehicleId:
 *                 type: string
 *                 example: 69537051b671a353ddfa94d7
 *               selectedSeats:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["A1", "A2"] 
 *               paymentMethod:
 *                 type: string
 *                 example: card
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation or seat availability error
 */

/**
 * @swagger
 * /api/booking/{id}:
 *   delete:
 *     summary: Cancel / delete a booking
 *     tags: [Booking]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 69536960b671a353ddfa94b5
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 */
