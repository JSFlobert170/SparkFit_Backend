const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createWorkout = async (req, res, next) => {
    const { date, duration, calories_burned, details, exercise } = req.body;
    try {
        const newWorkout = await prisma.workout.create({
            data: {
                user_id: req.userToken.admin? undefined : parseInt(req.userToken.id),
                date,
                duration,
                calories_burned,
                // details: {
                //     create: details || {}
                // },
                // details: {
                //     create: exercise || {}// `exercises` should be an array of objects containing exercise details
                // },
                details: {
                    create: exercise?.map(ex => ({
                        sets: ex.sets,
                        reps: ex.reps,
                        weight: ex.weight,
                        exercise: {
                            create: {
                                name: ex.name,
                                description: ex.description,
                                video_url: ex.video_url,
                                goal_type: ex.goal_type
                            }
                        }
                    }))
                }
            },
            include: {
                details: true,
                details: {
                    include: {
                        exercise: true,
                    }
                },
                exercise: true,
                user: true
            }
        });
        return res.json({
            status: 201,
            message: "Workout created successfully",
            data: newWorkout,
        });

    } catch (err) {
        return res.json({
            status: err.status,
            message: err.message || "Bad request",
        });
    }
};

exports.getWorkouts = async (req, res, next) => {
    try {
        const workouts = await prisma.workout.findMany({
            // include: {
            //     details: true,
            //     // details: {
            //     //     include: {
            //     //         exercise: true,
            //     //     }
            //     // },
            //     user: true
            // }
        });
        if (!workouts) {
            return res.json({
              status: 404,
              message: "Workouts not found",
            });
        }
        return res.json({
            status: 200,
            message: "Successfully retrieved all workouts",
            data: workouts
        });
    } catch (err) {
        return res.json({
            status: err.status,
            message: err.message || "Bad request",
        });
    }
};

exports.getWorkout = async (req, res, next) => {
    try {
        const { id } = req.params;
    if (!id) {
      return res.json({
        status: 400,
        message: "Id is required",
      });
    }
    const workout = await prisma.workout.findUnique({
      where: { workout_id: parseInt(id) },
      include: {
        details: true,
        details: {
            include: {
                exercise: true,
            }
        },
        exercise: true,
        user: true,
      }
    });
    if (!workout) {
      return res.json({
        status: 404,
        message: "Workout not found",
      });
  }
      return res.json({
        status  : 200,  
        message : "Successfully retrieved Workout",
        data : workout
      });

    } catch (err) {
        return res.json({
            status: err.status,
            message: err.message || "Bad request",
        });
    }
};

exports.updateWorkout = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userTokenId = req.userToken.id;
        const { date, duration, calories_burned, details, exercise } = req.body;
        console.log(req.body)
        console.log(req.userToken)

        if (!id || !userTokenId || !req.body) {
        return res.json({
            status: 400,
            message: "Id is required",
        });
        }

        if (id != req.userToken.id && req.userToken.admin != true) {
        return res.json({
            status: 401,
            message: "Unauthorized",
        });
        }

        // Préparer l'objet data pour la mise à jour
        const updateData = {
            date,
            duration,
            calories_burned
        };

        // Ajouter conditionnellement la mise à jour du profil
        if (details) {
            updateData.details = {
                update: {
                ...details
                }
            };
        };
        if (exercise) {
            updateData.exercise = {
                update: {
                ...exercise
                }
            };
        };
        
        const updatedWorkout = await prisma.workout.update({
            where: { user_id: parseInt(id) },
            data: updateData,
            include: {
                details: true,
                details: {
                    include: {
                        exercise: true,
                    }
                },
                user: true
            }
        });
        if (!updatedWorkout) {
            return res.json({
            status: 404,
            message: "Workout is not found",
            });
        }
        return res.json({
            status  : 200,
            message : "Successfully updated workout",
            data : updatedWorkout
        });

    } catch (err) {
        return res.json({
            status: err.status,
            message: err.message || "Bad request",
        });
    }
};

exports.deleteWorkout = async (req, res, next) => {
    if (!req.userToken.admin) {
      return res.json({
          status: 401,
          message: "Unauthorized",
      });
    }
    const id = req.params.id;
    if (!id) {
        return res.json({
            status: 400,
            message: "Id is required",
        });
    }
    try {
        const deletedWorkoutDetails = await prisma.workout_Detail.deleteMany({
            where: { workout_id : parseInt(id) }
        });

        const deletedWorkout = await prisma.workout.delete({
            where: { workout_id: parseInt(id) }
        });
        if (!deletedWorkout) {
            return res.json({
              status: 404,
              message: "Workout is not found",
            });
        }
        return res.json({
            status  : 204,
            message : "Successfully deleted user",
            deletedWorkoutDetails : deletedWorkoutDetails,
            deletedWorkout : deletedWorkout
        });

    } catch (err) {
        return res.json({
            status: err.status,
            message: err.message || "Bad request",
        }); 
    }
};


// exports.getUserWorkouts = async (req, res, next) => {
//     try {
//         const workouts = await prisma.workout.findMany({
//             // include: {
//             //     details: true,
//             //     // details: {
//             //     //     include: {
//             //     //         exercise: true,
//             //     //     }
//             //     // },
//             //     user: true
//             // }
//         });
//         if (!workouts) {
//             return res.json({
//               status: 404,
//               message: "Workouts not found",
//             });
//         }
//         return res.json({
//             status: 200,
//             message: "Successfully retrieved all workouts",
//             data: workouts
//         });
//     } catch (err) {
//         return res.json({
//             status: err.status,
//             message: err.message || "Bad request",
//         });
//     }
// };

