const router = require("express").Router();
const db = require("../../config/db");

/* GET ALL PUBLIC CLIENTS */
router.get("/", async (req, res) => {
  try {

    const result = await db.query(`
      SELECT *
      FROM public_clients
      ORDER BY sort_order ASC, id DESC
    `);

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Gabim në marrjen e klientëve."
    });

  }
});


/* CREATE */
router.post("/", async (req, res) => {

  try {

    const {
      name,
      image,
      website,
      sort_order,
      is_active
    } = req.body;

    const result = await db.query(
`
INSERT INTO public_clients
(
name,
image,
website,
sort_order,
is_active
)

VALUES ($1,$2,$3,$4,$5)

RETURNING *
`,
[
name,
image,
website,
sort_order,
is_active
]
);

res.status(201).json(result.rows[0]);

} catch (err) {

console.error(err);

res.status(500).json({
message:"Gabim në ruajtjen e klientit."
});

}

});


/* UPDATE */
router.put("/:id", async (req,res)=>{

try{

const {
name,
image,
website,
sort_order,
is_active
}=req.body;

const result = await db.query(
`
UPDATE public_clients
SET
name=$1,
image=$2,
website=$3,
sort_order=$4,
is_active=$5

WHERE id=$6

RETURNING *
`,
[
name,
image,
website,
sort_order,
is_active,
req.params.id
]
);

res.json(result.rows[0]);

}catch(err){

console.error(err);

res.status(500).json({
message:"Gabim në përditësim."
});

}

});


/* DELETE */
router.delete("/:id", async(req,res)=>{

try{

await db.query(
`DELETE FROM public_clients WHERE id=$1`,
[req.params.id]
);

res.json({
message:"Klienti u fshi."
});

}catch(err){

console.error(err);

res.status(500).json({
message:"Gabim në fshirje."
});

}

});

module.exports = router;