import prisma from "~/lib/prisma";

/**
 * @swagger
 * /api/entry/flow/add:
 *   post:
 *     summary: 添加流水记录
 *     tags: ["Flow"]
 *     security:
 *       - Authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: 账本ID
 *               day:
 *                 type: string
 *                 description: 日期
 *               flowType:
 *                 type: string
 *                 description: 流水类型（收入、支出）
 *               industryType:
 *                 type: string
 *                 description: 行业分类
 *               payType:
 *                 type: string
 *                 description: 支付方式
 *               name:
 *                 type: string
 *                 description: 流水名称
 *               money:
 *                 type: number
 *                 description: 金额
 *               description:
 *                 type: string
 *                 description: 描述
 *               attribution:
 *                 type: string
 *                 description: 归属
 *     responses:
 *       200:
 *         description: 流水记录添加成功
 *         content:
 *           application/json:
 *             schema:
 *               Result: {
 *                 d: Flow 流水记录信息
 *               }
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event); // 获取请求体

  if (!body.bookId) {
    return;
  }
  const userId = await getUserId(event);
  const flow = {
    userId: userId,
    bookId: String(body.bookId),
    day: String(body.day || ""),
    flowType: String(body.flowType || ""), // 流水类型：收入、支出
    industryType: String(body.industryType || ""), // 行业分类 原 type（收入类型、支出类型）
    payType: String(body.payType || ""), // 支付方式
    name: String(body.name || ""),
    money: Number(body.money || ""),
    description: String(body.description || ""),
    // invoice: String(body.invoice || ""),
    attribution: String(body.attribution || ""),
  };

  // 在数据库中添加新数据
  const created = await prisma.flow.create({
    data: flow,
  });
  return success(created);
});
