from manim import *
import numpy as np

class DichotomyParadox(Scene):
    def construct(self):
        # Title
        title = Text("Zeno's Dichotomy Paradox", font_size=48, color=BLUE)
        subtitle = Text("Can you ever reach your destination?", font_size=32, color=WHITE)
        subtitle.next_to(title, DOWN, buff=0.5)
        
        self.play(Write(title), Write(subtitle))
        self.wait(2)
        self.play(FadeOut(title), FadeOut(subtitle))
        
        # Set up the path
        path_start = LEFT * 5
        path_end = RIGHT * 3
        path_line = Line(path_start, path_end, color=WHITE, stroke_width=8)
        
        # Character (dot) at start
        character = Dot(path_start, color=YELLOW, radius=0.15)
        character_label = Text("Runner", font_size=24, color=YELLOW).next_to(character, DOWN, buff=0.3)
        
        # Wall at end
        wall = Rectangle(width=0.3, height=1, color=RED, fill_opacity=1).move_to(path_end)
        wall_label = Text("Wall", font_size=24, color=RED).next_to(wall, DOWN, buff=0.3)
        
        # Show initial setup
        setup_text = Text("To reach the wall, you must first cover half the distance.", 
                         font_size=32, color=WHITE).to_edge(UP)
        
        self.play(Create(path_line))
        self.play(FadeIn(character), Write(character_label))
        self.play(FadeIn(wall), Write(wall_label))
        self.play(Write(setup_text))
        self.wait(2)
        
        # Track positions and fractions
        current_pos = 0  # 0 to 1 scale
        path_length = np.linalg.norm(path_end - path_start)
        fractions = [1/2, 1/4, 1/8, 1/16, 1/32]
        
        # Step 1: Move to 1/2
        self.play(FadeOut(setup_text))
        half_text = Text("Moving half the distance: 1/2", font_size=32, color=GREEN).to_edge(UP)
        self.play(Write(half_text))
        
        target_pos = path_start + (path_end - path_start) * 0.5
        fraction_marker = MathTex(r"\frac{1}{2}", color=GREEN, font_size=36).next_to(target_pos, UP, buff=0.5)
        
        self.play(character.animate.move_to(target_pos), Write(fraction_marker))
        
        # Highlight remaining distance
        remaining_line = Line(target_pos, path_end, color=ORANGE, stroke_width=6)
        remaining_text = Text("Remaining distance", font_size=24, color=ORANGE).next_to(remaining_line, UP, buff=0.2)
        
        self.play(Create(remaining_line), Write(remaining_text))
        self.wait(2)
        
        # Step 2: Move to 3/4
        self.play(FadeOut(half_text), FadeOut(remaining_text), FadeOut(remaining_line))
        quarter_text = Text("Then, half of the remaining distance: 1/4", font_size=32, color=GREEN).to_edge(UP)
        self.play(Write(quarter_text))
        
        target_pos = path_start + (path_end - path_start) * 0.75
        fraction_marker2 = MathTex(r"\frac{1}{4}", color=GREEN, font_size=36).next_to(target_pos, UP, buff=0.5)
        
        self.play(character.animate.move_to(target_pos), Write(fraction_marker2))
        
        # Highlight new remaining distance
        remaining_line2 = Line(target_pos, path_end, color=ORANGE, stroke_width=6)
        remaining_text2 = Text("New remaining distance", font_size=24, color=ORANGE).next_to(remaining_line2, UP, buff=0.2)
        
        self.play(Create(remaining_line2), Write(remaining_text2))
        self.wait(2)
        
        # Continue the pattern for a few more steps
        positions = [0.875, 0.9375, 0.96875]
        fraction_texts = [r"\frac{1}{8}", r"\frac{1}{16}", r"\frac{1}{32}"]
        
        for i, (pos, frac_text) in enumerate(zip(positions, fraction_texts)):
            self.play(FadeOut(quarter_text) if i == 0 else FadeOut(step_text), 
                     FadeOut(remaining_text2) if i == 0 else FadeOut(remaining_text_step), 
                     FadeOut(remaining_line2) if i == 0 else FadeOut(remaining_line_step))
            
            step_text = Text(f"Moving half again: {frac_text.replace('frac', 'fraction')}", 
                           font_size=32, color=GREEN).to_edge(UP)
            self.play(Write(step_text))
            
            target_pos = path_start + (path_end - path_start) * pos
            fraction_marker_step = MathTex(frac_text, color=GREEN, font_size=36).next_to(target_pos, UP, buff=0.5)
            
            self.play(character.animate.move_to(target_pos), Write(fraction_marker_step))
            
            # Highlight remaining distance
            remaining_line_step = Line(target_pos, path_end, color=ORANGE, stroke_width=6)
            remaining_text_step = Text("Still remaining...", font_size=24, color=ORANGE).next_to(remaining_line_step, UP, buff=0.2)
            
            self.play(Create(remaining_line_step), Write(remaining_text_step))
            self.wait(1.5)
        
        # Clean up for the explanation
        self.play(FadeOut(step_text), FadeOut(remaining_text_step), FadeOut(remaining_line_step))
        
        # Show the infinite process
        infinite_text = Text("This process repeats infinitely.", font_size=36, color=YELLOW).to_edge(UP)
        infinite_text2 = Text("You always have 'half' of some distance left to cover.", 
                             font_size=32, color=YELLOW).next_to(infinite_text, DOWN, buff=0.3)
        
        self.play(Write(infinite_text), Write(infinite_text2))
        self.wait(3)
        
        # Mathematical series
        self.play(FadeOut(infinite_text), FadeOut(infinite_text2))
        
        series_title = Text("The Mathematical Series:", font_size=36, color=BLUE).to_edge(UP)
        series_eq = MathTex(
            r"\frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \frac{1}{16} + \frac{1}{32} + \cdots = ?",
            font_size=48, color=WHITE
        ).next_to(series_title, DOWN, buff=0.5)
        
        self.play(Write(series_title), Write(series_eq))
        self.wait(2)
        
        # Show that it equals 1
        equals_one = MathTex(r"= 1", font_size=48, color=GREEN).next_to(series_eq, RIGHT, buff=0.3)
        self.play(Write(equals_one))
        
        explanation = Text("The sum approaches 1, but through discrete steps,", font_size=28, color=WHITE)
        explanation2 = Text("it technically never reaches it in finite time.", font_size=28, color=WHITE)
        explanation.next_to(series_eq, DOWN, buff=0.8)
        explanation2.next_to(explanation, DOWN, buff=0.3)
        
        self.play(Write(explanation), Write(explanation2))
        self.wait(3)
        
        # Resolution
        self.play(FadeOut(series_title), FadeOut(series_eq), FadeOut(equals_one), 
                 FadeOut(explanation), FadeOut(explanation2))
        
        resolution_text = Text("The Paradox Resolution:", font_size=36, color=BLUE).to_edge(UP)
        resolution1 = Text("Motion is possible because time is also infinitely divisible.", font_size=28, color=WHITE)
        resolution2 = Text("The infinite series of time intervals also sums to a finite value.", font_size=28, color=WHITE)
        
        resolution1.next_to(resolution_text, DOWN, buff=0.5)
        resolution2.next_to(resolution1, DOWN, buff=0.3)
        
        self.play(Write(resolution_text), Write(resolution1), Write(resolution2))
        
        # Final animation: character reaches the wall
        final_pos = path_end + LEFT * 0.15  # Just before the wall
        self.play(character.animate.move_to(final_pos), run_time=2)
        
        success_text = Text("The runner reaches the wall!", font_size=32, color=GREEN)
        success_text.next_to(character, UP, buff=1)
        self.play(Write(success_text))
        
        self.wait(3)
        
        # Final message
        final_message = Text("Calculus teaches us that infinite series can have finite sums!", 
                           font_size=32, color=YELLOW).to_edge(DOWN)
        self.play(Write(final_message))
        self.wait(3)