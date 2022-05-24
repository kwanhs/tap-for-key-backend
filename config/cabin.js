const Cabin = require('../hardware/cabin')
const { DISABLE_CHECK } = require('./argv')

const channel = [
    1,	//	Cell	1
    8,	//	Cell	2
    15,	//	Cell	3
    22,	//	Cell	4
    2,	//	Cell	5
    9,	//	Cell	6
    16,	//	Cell	7
    23,	//	Cell	8
    3,	//	Cell	9
    10,	//	Cell	10
    17,	//	Cell	11
    24,	//	Cell	12
    4,	//	Cell	13
    11,	//	Cell	14
    18,	//	Cell	15
    25,	//	Cell	16
    26,	//	Cell	17
    33,	//	Cell	18
    40,	//	Cell	19
    47,	//	Cell	20
    27,	//	Cell	21
    34,	//	Cell	22
    41,	//	Cell	23
    48,	//	Cell	24
    28,	//	Cell	25
    35,	//	Cell	26
    42,	//	Cell	27
    49,	//	Cell	28    
]

const cabin = new Cabin(28, channel);

module.exports = {
    cabin,
    NO_DOOR_CHECK: DISABLE_CHECK,
};