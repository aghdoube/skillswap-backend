import Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().required(),  
  email: Joi.string().email().required(),  
  password: Joi.string().min(8).max(12).required(),  
  profilePic: Joi.string().optional(),
  location: Joi.string().optional(),
  bio: Joi.string().optional(),
  skillsOffered: Joi.array().items(Joi.object({
    skill: Joi.string().required(),
    level: Joi.string().required(),
  })).optional(),
  skillsWanted: Joi.array().items(Joi.object({
    skill: Joi.string().required(),
    level: Joi.string().required(),
  })).optional(),
});

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(12).required(),
});
