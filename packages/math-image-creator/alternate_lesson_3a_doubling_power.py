from manim import *
import numpy as np

class DoublingPower(Scene):
    def construct(self):
        # Title
        title = Text("Potęgi Dwójki (\"Podwojenia\")", font_size=48)
        subtitle = Text("Skala logarytmiczna jest zbudowana na liczeniu podwojeń", font_size=24)
        subtitle.next_to(title, DOWN)
        
        self.play(Write(title))
        self.play(FadeIn(subtitle))
        self.wait(2)
        self.play(FadeOut(title, subtitle))

        # Initial paper
        paper = Line(LEFT * 3, RIGHT * 3, stroke_width=2, color=BLUE)
        thickness_label = Text("Grubość: 0.1mm", font_size=20).next_to(paper, DOWN, buff=1)
        fold_counter = Text("Złożenia: 0", font_size=20).next_to(paper, UP, buff=1)
        
        self.play(
            Create(paper),
            Write(thickness_label),
            Write(fold_counter)
        )
        self.wait()

        # Track thickness value
        thickness = 0.1
        
        # First 7 folds with visual animation
        for fold_num in range(1, 8):
            # Animate folding
            if fold_num <= 3:
                # Show actual folding animation for first 3
                fold_point = paper.get_center()
                left_half = Line(paper.get_start(), fold_point, stroke_width=2 + fold_num, color=BLUE)
                right_half = Line(fold_point, paper.get_end(), stroke_width=2 + fold_num, color=BLUE)
                
                self.play(
                    Rotate(right_half, angle=PI, about_point=fold_point),
                    run_time=0.8
                )
                
                # Update to thicker line
                thickness *= 2
                new_paper = Line(
                    paper.get_start(), 
                    paper.get_center(), 
                    stroke_width=min(2 * (2**fold_num), 20),
                    color=BLUE
                )
                
                self.play(
                    Transform(paper, new_paper),
                    FadeOut(left_half),
                    FadeOut(right_half),
                    run_time=0.5
                )
            else:
                # For later folds, just increase thickness
                thickness *= 2
                new_paper = Line(
                    paper.get_start(),
                    paper.get_start() + RIGHT * (6 / (1.5**fold_num)),
                    stroke_width=min(20 + (fold_num - 3) * 5, 50),
                    color=BLUE
                )
                self.play(Transform(paper, new_paper), run_time=0.5)
            
            # Update labels
            new_thickness_label = Text(f"Grubość: {thickness:.1f}mm", font_size=20).next_to(paper, DOWN, buff=1)
            new_fold_counter = Text(f"Złożenia: {fold_num}", font_size=20).next_to(paper, UP, buff=1)
            
            self.play(
                Transform(thickness_label, new_thickness_label),
                Transform(fold_counter, new_fold_counter),
                run_time=0.5
            )
            
            # Add milestone text at 7 folds
            if fold_num == 7:
                milestone = Text("Grubość zeszytu!", font_size=24, color=YELLOW)
                milestone.next_to(thickness_label, DOWN)
                self.play(FadeIn(milestone))
                self.wait()
                self.play(FadeOut(milestone))

        # Speed up for remaining folds
        milestones = [
            (10, "Grubość książki", 102.4),
            (20, "Grubość wieżowca", 104857.6),
            (25, "Grubość góry", 3355443.2),
            (42, "Dystans na Księżyc!", 439804651110.4)
        ]
        
        for fold_num, description, thickness_mm in milestones:
            # Quick update
            new_thickness_label = Text(f"Grubość: {thickness_mm/1000:.1f}m", font_size=20).next_to(paper, DOWN, buff=1)
            new_fold_counter = Text(f"Złożenia: {fold_num}", font_size=20).next_to(paper, UP, buff=1)
            
            if fold_num <= 25:
                bigger_paper = Rectangle(
                    width=3,
                    height=min(1 + (fold_num - 7) * 0.2, 4),
                    fill_color=BLUE,
                    fill_opacity=0.8,
                    stroke_width=2
                )
                self.play(
                    Transform(paper, bigger_paper),
                    Transform(thickness_label, new_thickness_label),
                    Transform(fold_counter, new_fold_counter),
                    run_time=0.5
                )
            else:
                # For moon distance, make paper shoot up
                self.play(
                    paper.animate.shift(UP * 10),
                    Transform(thickness_label, new_thickness_label),
                    Transform(fold_counter, new_fold_counter),
                    run_time=1
                )
            
            # Show milestone
            milestone = Text(description, font_size=28, color=YELLOW)
            milestone.to_edge(RIGHT)
            self.play(FadeIn(milestone))
            self.wait(0.5 if fold_num < 42 else 2)
            self.play(FadeOut(milestone))

        # Clear for final visualization
        self.play(
            FadeOut(paper),
            FadeOut(thickness_label),
            FadeOut(fold_counter)
        )

        # Final visualization - two number lines
        self.final_visualization()

    def final_visualization(self):
        # Title
        final_title = Text("Podsumowanie: Równe kroki → Wykładnicze skoki", font_size=32)
        final_title.to_edge(UP)
        self.play(Write(final_title))

        # Linear axis (number of folds)
        linear_axis = NumberLine(
            x_range=[0, 10, 1],
            length=10,
            include_numbers=True,
            font_size=20,
            numbers_to_include=range(0, 11)
        ).shift(UP)
        
        linear_label = Text("Liczba Złożeń", font_size=24).next_to(linear_axis, UP)
        
        # Logarithmic axis (thickness)
        # We'll create custom labels for powers of 2
        log_axis = Line(LEFT * 5, RIGHT * 5).shift(DOWN * 2)
        log_label = Text("Grubość (mm)", font_size=24).next_to(log_axis, DOWN)
        
        self.play(
            Create(linear_axis),
            Write(linear_label),
            Create(log_axis),
            Write(log_label)
        )

        # Add thickness values
        thickness_values = []
        for i in range(11):
            thickness = 0.1 * (2**i)
            # Position on log scale
            if i == 0:
                pos = log_axis.get_start()
            else:
                # Logarithmic spacing
                pos = log_axis.get_start() + RIGHT * (i * 10/10)
            
            if i <= 5:
                label = Text(f"{thickness:.1f}", font_size=14)
            else:
                label = Text(f"{thickness:.0f}", font_size=14)
            label.next_to(pos, DOWN, buff=0.2)
            thickness_values.append(label)
        
        self.play(*[Write(label) for label in thickness_values])

        # Draw connecting lines
        connections = []
        for i in range(11):
            start_point = linear_axis.n2p(i) + DOWN * 0.1
            end_point = log_axis.get_start() + RIGHT * (i * 10/10) + UP * 0.1
            line = Line(start_point, end_point, stroke_width=1, color=YELLOW, stroke_opacity=0.5)
            connections.append(line)
        
        self.play(*[Create(line) for line in connections])

        # Highlight the exponential nature
        highlight_text = VGroup(
            Text("Każde złożenie = ×2", font_size=20, color=GREEN),
            Text("10 złożeń = ×1024!", font_size=20, color=GREEN)
        ).arrange(DOWN).to_edge(RIGHT)
        
        self.play(Write(highlight_text))
        self.wait(3)