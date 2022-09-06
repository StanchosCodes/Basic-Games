namespace SimpleSnake.GameObjects.Foods
{

    using System;
    
    public class FoodHeart : Food
    {
        private const int foodPoints = 10;
        private const char foodSymbol = '\u2665';
        private const ConsoleColor foodColor = ConsoleColor.Magenta;

        public FoodHeart(Field field)
            : base(field, foodPoints, foodSymbol, foodColor)
        {

        }
    }
}
