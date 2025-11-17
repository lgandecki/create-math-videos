from manim import *

class AddingIntegersVisually(Scene):
    def construct(self):
        # Create title
        title = Text("Adding Integers Visually", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(0.5)
        
        # Show the problem first
        problem = MathTex("2 + 3", font_size=36, color=WHITE)
        problem.shift(UP * 2)
        self.play(Write(problem))
        self.wait(1)
        
        # Create number line
        number_line = NumberLine(
            x_range=[-1, 7, 1],
            length=12,
            color=WHITE,
            include_numbers=True,
            numbers_to_include=range(-1, 8),
            font_size=24
        )
        number_line.shift(DOWN * 0.5)
        
        self.play(Create(number_line))
        self.wait(0.5)
        
        # Create a point/character (using a dot)
        point = Dot(color=RED, radius=0.15)
        point.move_to(number_line.number_to_point(0))
        
        self.play(FadeIn(point))
        self.wait(0.5)
        
        # Label the starting position
        start_label = Text("Start at 0", font_size=24, color=YELLOW)
        start_label.next_to(point, UP, buff=0.3)
        self.play(Write(start_label))
        self.wait(1)
        
        # Move to position 2 (first jump)
        self.play(FadeOut(start_label))
        
        # Show first movement
        first_move_label = Text("Move right 2 units", font_size=24, color=GREEN)
        first_move_label.shift(UP * 1.5)
        self.play(Write(first_move_label))
        
        # Animate the jump to 2
        self.play(
            point.animate.move_to(number_line.number_to_point(2)),
            run_time=1.5
        )
        
        # Label position 2
        pos_2_label = Text("At 2", font_size=24, color=YELLOW)
        pos_2_label.next_to(point, UP, buff=0.3)
        self.play(Write(pos_2_label))
        self.wait(1)
        
        # Remove labels before next move
        self.play(FadeOut(first_move_label), FadeOut(pos_2_label))
        
        # Show second movement
        second_move_label = Text("Move right 3 more units", font_size=24, color=GREEN)
        second_move_label.shift(UP * 1.5)
        self.play(Write(second_move_label))
        
        # Animate the jump from 2 to 5
        self.play(
            point.animate.move_to(number_line.number_to_point(5)),
            run_time=1.5
        )
        
        # Label final position
        final_label = Text("At 5", font_size=24, color=YELLOW)
        final_label.next_to(point, UP, buff=0.3)
        self.play(Write(final_label))
        self.wait(1)
        
        # Remove movement label
        self.play(FadeOut(second_move_label))
        
        # Show the complete equation
        self.play(FadeOut(problem))  # Remove the original problem
        
        complete_equation = MathTex("2 + 3 = 5", font_size=48, color=BLUE)
        complete_equation.shift(UP * 2)
        self.play(Write(complete_equation))
        
        # Highlight the answer
        answer_box = SurroundingRectangle(complete_equation[-1], color=GREEN, buff=0.1)
        self.play(Create(answer_box))
        
        self.wait(2)
        
        # Final emphasis
        self.play(
            point.animate.scale(1.5),
            final_label.animate.set_color(GREEN),
            run_time=0.5
        )
        
        self.wait(3)