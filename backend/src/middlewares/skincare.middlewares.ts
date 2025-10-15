import { checkSchema } from 'express-validator';
import { validate } from '../utils/validation';
import { AIFeedbackFeature } from '~/models/requests/Ai.requests';
export const skincareAdviceValidator = validate(
    checkSchema({
        base64Image: {
            in: ['body'],
            notEmpty: { errorMessage: 'base64Image is required' },
            isString: { errorMessage: 'base64Image must be a string' },
            custom: {
                options: (value) => {
                    if (!value.startsWith('data:image')) {
                        throw new Error('Image must be a data URL (e.g., data:image/jpeg;base64,...)');
                    }
                    return true;
                }
            }
        },
        userBudgetUSD: {
            in: ['body'],
            optional: true,
            isNumeric: { errorMessage: 'userBudgetUSD must be a number' }
        },
        userSchedulePreference: {
            in: ['body'],
            optional: true,
            isString: { errorMessage: 'userSchedulePreference must be a string' }
        },
        userPreferredSkinType: {
            in: ['body'],
            optional: true,
            isString: { errorMessage: 'userPreferredSkinType must be a string' }
        },
        preferredBrands: {
            in: ['body'],
            optional: true,
            isArray: { errorMessage: 'preferredBrands must be an array of strings' }
        },
        preferredIngredients: {
            in: ['body'],
            optional: true,
            isArray: { errorMessage: 'preferredIngredients must be an array of strings' }
        },
        preferredOrigins: {
            in: ['body'],
            optional: true,
            isArray: { errorMessage: 'preferredOrigins must be an array of strings' }
        },
        preferredProductTypes: {
            in: ['body'],
            optional: true,
            isArray: { errorMessage: 'preferredProductTypes must be an array of strings' }
        },
        preferredUses: {
            in: ['body'],
            optional: true,
            isArray: { errorMessage: 'preferredUses must be an array of strings' }
        },
        preferredCharacteristics: {
            in: ['body'],
            optional: true,
            isArray: { errorMessage: 'preferredCharacteristics must be an array of strings' }
        },
        preferredSizes: {
            in: ['body'],
            optional: true,
            isArray: { errorMessage: 'preferredSizes must be an array of strings' }
        },
        language: {
            in: ['body'],
            optional: true,
            isString: { errorMessage: 'language must be a string' }
        }
    })
);

const allowedFeatures: AIFeedbackFeature[] = ['skincare_analysis', 'expert_chat'];

export const aiFeedbackValidator = validate(
    checkSchema({
        feature: {
            in: ['body'],
            notEmpty: { errorMessage: 'feature is required' },
            isIn: {
                options: [allowedFeatures],
                errorMessage: 'feature must be one of skincare_analysis or expert_chat'
            }
        },
        rating: {
            in: ['body'],
            notEmpty: { errorMessage: 'rating is required' },
            isInt: {
                options: { min: 1, max: 5 },
                errorMessage: 'rating must be an integer between 1 and 5'
            }
        },
        comment: {
            in: ['body'],
            optional: true,
            isString: { errorMessage: 'comment must be a string' },
            isLength: {
                options: { max: 500 },
                errorMessage: 'comment must be at most 500 characters long'
            }
        },
        interactionId: {
            in: ['body'],
            optional: true,
            isString: { errorMessage: 'interactionId must be a string' },
            isLength: {
                options: { max: 100 },
                errorMessage: 'interactionId must be at most 100 characters long'
            }
        }
    })
);
