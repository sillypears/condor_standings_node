const conn = require('../db.js');

// @Title APIDocs
// @Description Describes the API
// @Accept plain
// @Produce json
// @Router /api/event [get]
exports.api = function(req, res, next) {
res.json({
        'api': {
            'version': '1.0',
            'description': 'API Homepage',
            'author': 'sillypears',
            'email': 'sillypairs@gmail.com',
            'path': '/api'
        },
        'events': {
            'version': '1.0',
            'description': 'Returns list of all events found',
            'method': 'get',
            'accepts': 'plain',
            'returns': 'json',
            'path': '/api/event'
        },
        'event': {
            'version': '1.0',
            'description': 'Returns list of single event provided',
            'method': 'get',
            'accepts': 'plain',
            'returns': 'json',
            'path': '/api/event/:eventname'
        },
        'teamresults': {
            'version': '1.0',
            'description': 'Returns list of team results from season 6',
            'method': 'get',
            'accepts': 'plain',
            'returns': 'json',
            'path': '/api/teamresults'
        }
    }
)
};

// @Title Events
// @Description Lists all events found by name
// @Accept plain
// @Produce json
// @Router /api/event [get]
exports.events = function(req, res, next) {
    let sql =   `
            SELECT
                DISTINCT(ist.table_schema),
                nl.league_name
            FROM
                INFORMATION_SCHEMA.TABLES ist
            LEFT JOIN
                necrobot.leagues nl
                    ON nl.schema_name = ist.table_schema
            WHERE
            table_schema not in ('information_schema', 'necrobot' )
            ORDER BY
            create_time DESC`;
    conn.query(sql, function(error, results, fields) {
        if (error) {
            res.json({
                'error': {
                    'status_code': -2,
                    'message': error,
                }
            });
            
        } else {
            res.json({
                'results': results
            });
        }
    });
    
};

// @Title Event Listing
// @Description Lists everything found for the event
// @Accept plain
// @Produce json
// @Param event	path	string	true	"Event Name"
// @Router /api/event/{event} [get]
// httpEventAPI gets listings for the events
exports.event = function(req, res, next) {
    let sql = ``;
    const eventName = req.params.event.trim();
    if (eventName.includes('nwdc')) {
        sql = `
            SELECT
                u.discord_name AS Username,
                u.twitch_name as tUsername,
                u.user_id as racerId,
                (SELECT	COUNT(rs.winner_id)
                    FROM ` + eventName + `.race_summary rs
                    WHERE rs.winner_id = u.user_id
                ) as wins,
                (SELECT	COUNT(rs.winner_id)
                    FROM ` + eventName + `.race_summary rs
                    WHERE rs.loser_id = u.user_id
                ) as losses,
                e.group
            FROM
                ` + eventName + `.entrants e
                    LEFT JOIN
                necrobot.users u ON u.user_id = e.user_id
            WHERE
                u.discord_id IS NOT NULL
                AND u.discord_name IS NOT NULL
                AND u.twitch_name IS NOT NULL
                AND u.user_id IS NOT NULL
            GROUP BY u.user_id
            ORDER BY e.group, wins desc, losses asc, tUsername asc`;
    } else {
        sql = `
            SELECT
                u.discord_name AS Username,
                u.twitch_name as tUsername,
                u.user_id as racerId,
                (SELECT	COUNT(*)
                    FROM ` + eventName + `.race_summary rs
                    WHERE rs.winner_id = u.user_id
                ) as wins,
                (SELECT	COUNT(*)
                    FROM ` + eventName + `.race_summary rs
                    WHERE rs.loser_id = u.user_id
                ) as losses
            FROM
                ` + eventName + `.entrants e
                    LEFT JOIN
                necrobot.users u ON u.user_id = e.user_id
            WHERE
                u.discord_id IS NOT NULL
                AND u.discord_name IS NOT NULL
                AND u.twitch_name IS NOT NULL
                AND u.user_id IS NOT NULL
            GROUP BY u.user_id
            ORDER BY wins desc, losses asc, tUsername asc`;
    }
    console.log(sql);
    conn.query(sql, function (error, results, fields) {
        if (error) {
            res.json({
                'error': {
                    'status_code': -2,
                    'message': error,
                }
            });
        } else {
            res.json({
                'results': results
            });
        }
    });
    
};

// @Title Team Results Listing
// @Description Lists everything found for the season 7 teams
// @Accept plain
// @Produce json
// @Router /api/teamresults [get]

exports.teamresults = function(req, res, next) {
    let sql =   `
		SELECT
		    u1.twitch_name AS racer1,
		    s7t1.team AS team1,
		    u2.twitch_name AS racer2,
		    s7t2.team AS team2,
		    mr.winner
		FROM
		    season_7.matches m
		        LEFT JOIN
		    necrobot.users u1 ON u1.user_id = m.racer_1_id
		        LEFT JOIN
		    necrobot.users u2 ON u2.user_id = m.racer_2_id
		        RIGHT JOIN
		    season_7.season_7_teams s7t1 ON s7t1.user_id = m.racer_1_id
		        RIGHT JOIN
		    season_7.season_7_teams s7t2 ON s7t2.user_id = m.racer_2_id
		        LEFT JOIN
		    season_7.match_races mr ON mr.match_id = m.match_id
		        LEFT JOIN
		    season_7.race_runs rr ON rr.race_id = mr.race_id
		WHERE
		    rr.level = -2
        GROUP BY mr.race_id`;
    conn.query(sql, function (error, results, fields) {
        if (error) {
            res.json({
                'error': {
                    'status_code': -2,
                    'message': error,
                }
            });
        } else {
            res.json({
                'results': results
            });
        }
    });
};

exports.s = function(req, res, next) {
    let sql =   `
        SELECT
            u.discord_name AS Username,
            u.twitch_name as tUsername,
            u.user_id as racerId,
            (SELECT	COUNT(*)
                FROM season_8.race_summary rs
                WHERE rs.winner_id = u.user_id
            ) as wins,
            (SELECT	COUNT(*)
                FROM season_8.race_summary rs
                WHERE rs.loser_id = u.user_id
            ) as losses
        FROM
            season_8.entrants e
                LEFT JOIN
            necrobot.users u ON u.user_id = e.user_id
        WHERE
            u.discord_id IS NOT NULL
            AND u.discord_name IS NOT NULL
            AND u.twitch_name IS NOT NULL
            AND u.user_id IS NOT NULL
        GROUP BY u.user_id
        ORDER BY wins desc, losses asc, tUsername asc;`
    conn.query(sql, function (error, results, fields) {
        if (error) {
            res.json({
                'error': {
                    'status_code': -2,
                    'reason': error,
                    'message': "Could not get the results"
                }
            });
        } else {
            res.json({
                'status_code': 0,
                'results': results
                });
        };
    });
};