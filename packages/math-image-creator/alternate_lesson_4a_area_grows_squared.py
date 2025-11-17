from manim import *

class AreaGrowsSquared(Scene):
    def construct(self):
        # Title
        title = Text("Pole rośnie z kwadratem długości", font_size=48)
        subtitle = Text("Połowa drogi do zrozumienia potęgi trzeciej", font_size=24)
        subtitle.next_to(title, DOWN)
        
        self.play(Write(title))
        self.play(FadeIn(subtitle))
        self.wait(2)
        self.play(FadeOut(title, subtitle))

        # First pizza - 20cm
        pizza1 = Circle(radius=1, color=ORANGE, fill_opacity=0.7)
        pizza1.shift(LEFT * 3.5)
        
        # Diameter line
        diameter1 = Line(
            pizza1.get_left(),
            pizza1.get_right(),
            color=RED,
            stroke_width=3
        )
        diameter_label1 = Text("Średnica: 20cm", font_size=20).next_to(pizza1, UP, buff=0.5)
        price_label1 = Text("Cena: 30 zł", font_size=24).next_to(pizza1, DOWN, buff=0.5)
        
        self.play(
            Create(pizza1),
            Create(diameter1),
            Write(diameter_label1),
            Write(price_label1)
        )
        self.wait()

        # Second pizza - 40cm (starts small, then grows)
        pizza2 = Circle(radius=1, color=ORANGE, fill_opacity=0.7)
        pizza2.shift(RIGHT * 3.5)
        
        diameter2 = Line(
            pizza2.get_left(),
            pizza2.get_right(),
            color=RED,
            stroke_width=3
        )
        diameter_label2 = Text("Średnica: 20cm", font_size=20).next_to(pizza2, UP, buff=0.5)
        
        self.play(
            Create(pizza2),
            Create(diameter2),
            Write(diameter_label2)
        )
        
        # Animate growth to 40cm
        bigger_pizza2 = Circle(radius=2, color=ORANGE, fill_opacity=0.7)
        bigger_pizza2.shift(RIGHT * 3.5)
        
        bigger_diameter2 = Line(
            bigger_pizza2.get_left(),
            bigger_pizza2.get_right(),
            color=RED,
            stroke_width=3
        )
        
        new_diameter_label2 = Text("Średnica: 40cm", font_size=20).next_to(bigger_pizza2, UP, buff=0.5)
        
        self.play(
            Transform(pizza2, bigger_pizza2),
            Transform(diameter2, bigger_diameter2),
            Transform(diameter_label2, new_diameter_label2)
        )
        self.wait()

        # Question about price
        price_question = Text("Cena: ??", font_size=24, color=YELLOW).next_to(pizza2, DOWN, buff=0.5)
        self.play(Write(price_question))
        self.wait()
        
        # Wrong answer
        wrong_answer = Text("60 zł?", font_size=24, color=RED).next_to(price_question, RIGHT)
        self.play(Write(wrong_answer))
        self.wait()
        
        # Cross out wrong answer
        cross = Cross(wrong_answer, stroke_color=RED, stroke_width=5)
        self.play(Create(cross))
        self.wait()

        # Visualize area with grid
        # Create grid of small squares on first pizza
        grid_size = 10
        square_size = 0.18
        grid1 = VGroup()
        
        for i in range(-5, 5):
            for j in range(-5, 5):
                # Check if square is inside circle
                x, y = i * square_size, j * square_size
                if x*x + y*y <= 0.9*0.9:  # Slightly smaller than radius
                    square = Square(side_length=square_size, stroke_width=1)
                    square.move_to(pizza1.get_center() + RIGHT * x + UP * y)
                    square.set_fill(YELLOW, opacity=0.3)
                    grid1.add(square)
        
        self.play(FadeIn(grid1))
        
        # Count squares
        count_text1 = Text(f"~{len(grid1)} kwadracików", font_size=18).next_to(pizza1, LEFT)
        self.play(Write(count_text1))
        self.wait()

        # Transform and show we need 4 copies for bigger pizza
        # Copy the grid 4 times
        grid_copies = VGroup()
        positions = [
            pizza2.get_center() + UP * 0.5 + LEFT * 0.5,
            pizza2.get_center() + UP * 0.5 + RIGHT * 0.5,
            pizza2.get_center() + DOWN * 0.5 + LEFT * 0.5,
            pizza2.get_center() + DOWN * 0.5 + RIGHT * 0.5
        ]
        
        for i, pos in enumerate(positions):
            grid_copy = grid1.copy()
            grid_copy.scale(0.95)  # Slightly smaller to fit
            self.play(
                grid_copy.animate.move_to(pos),
                run_time=0.5
            )
            grid_copies.add(grid_copy)
        
        # Merge into full grid
        full_grid2 = VGroup()
        for copy in grid_copies:
            full_grid2.add(*copy)
        
        self.play(
            full_grid2.animate.set_fill(YELLOW, opacity=0.2),
            run_time=0.5
        )
        
        # Show multiplication
        multiplication_text = Text("4 × mała pizza = duża pizza", font_size=20)
        multiplication_text.to_edge(UP)
        self.play(Write(multiplication_text))
        
        count_text2 = Text(f"~{len(grid1) * 4} kwadracików", font_size=18).next_to(pizza2, RIGHT)
        self.play(Write(count_text2))
        self.wait()

        # Correct answer
        self.play(
            FadeOut(wrong_answer, cross)
        )
        
        correct_price = Text("120 zł", font_size=24, color=GREEN).next_to(price_question, RIGHT)
        calculation = MathTex(r"4 \times 30\text{ zł} = 120\text{ zł}", font_size=20)
        calculation.next_to(correct_price, DOWN)
        
        self.play(
            Write(correct_price),
            Write(calculation)
        )
        self.wait()

        # Key insight
        self.play(
            FadeOut(grid1, grid_copies, full_grid2, count_text1, count_text2, multiplication_text)
        )
        
        # Mathematical relationship
        formula_title = Text("Kluczowy wniosek:", font_size=32).to_edge(UP)
        
        # Area formula
        area_formula = MathTex(
            r"\text{Pole} \propto \text{średnica}^2",
            font_size=36
        ).next_to(formula_title, DOWN, buff=1)
        
        # Examples
        example1 = MathTex(r"d = 20\text{cm} \Rightarrow A = \pi \cdot 10^2 = 100\pi", font_size=24)
        example2 = MathTex(r"d = 40\text{cm} \Rightarrow A = \pi \cdot 20^2 = 400\pi", font_size=24)
        examples = VGroup(example1, example2).arrange(DOWN).next_to(area_formula, DOWN, buff=1)
        
        self.play(
            Write(formula_title),
            Write(area_formula)
        )
        self.play(Write(examples))
        
        # Visual comparison
        ratio_text = MathTex(r"\frac{400\pi}{100\pi} = 4", font_size=28)
        ratio_text.next_to(examples, DOWN, buff=0.5)
        
        final_insight = Text(
            "Podwojenie średnicy = czterokrotność pola!",
            font_size=24,
            color=YELLOW
        ).to_edge(DOWN)
        
        self.play(
            Write(ratio_text),
            Write(final_insight)
        )
        self.wait(3)